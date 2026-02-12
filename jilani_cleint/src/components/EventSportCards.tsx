import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { useNavigate } from "react-router-dom";
import { getEvents } from "@/api/events";
import { getSports } from "@/api/sports";
import { getSupportedCountries, type Country } from "@/api/payment";
import { useToast } from "@/hooks/useToast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Calendar, MapPin, Clock, Award, Globe } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

// Utility function to calculate duration in days
const calculateDurationInDays = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return 'TBA';
  }

  const start = new Date(startDate);
  const end = new Date(endDate);


  // Check if dates are valid
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'TBA';
  }

  const durationInMs = end.getTime() - start.getTime();
  const durationInDays = Math.ceil(durationInMs / (1000 * 60 * 60 * 24));

  return durationInDays === 1 ? '1 day' : `${durationInDays} days`;
};

export function EventSportCards({ onRegister }) {
  
  const { userRole } = useAuth();
  const [events, setEvents] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState(null);
  const [sportDetailsOpen, setSportDetailsOpen] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<{ [sportId: string]: string }>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventsResponse, sportsResponse, countriesResponse] = await Promise.all([
          getEvents(),
          getSports(),
          getSupportedCountries()
        ]);
        setEvents(eventsResponse.events || []);
        setSports(sportsResponse.sports || []);
        setCountries(countriesResponse || []);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to load events and sports"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const handleSportClick = (sport) => {
    setSelectedSport(sport);
    setSportDetailsOpen(true);
  };

  const handleCountryChange = (sportId: string, countryCode: string) => {
    setSelectedCountries(prev => ({
      ...prev,
      [sportId]: countryCode
    }));
  };

  const handleRegisterClick = (sport, e) => {
    e.stopPropagation(); // Prevent the card click event
    if (!sport || !sport._id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Sport information is missing. Please try again."
      });
      return;
    }

    // Check if country is selected
    const selectedCountry = selectedCountries[sport._id];
    if (!selectedCountry) {
      toast({
        variant: "destructive",
        title: "Country Required",
        description: "Please select a country before registering."
      });
      return;
    }

    // If external onRegister is provided, use that
    if (onRegister) {
      onRegister(sport);
    } else {
      // Otherwise, navigate to student selection page with country
      navigate(`/student-selection?sportId=${sport._id}&sportName=${encodeURIComponent(sport.name)}&country=${selectedCountry}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getEventNameBySportId = (sportId) => {
    console.log(sportId)
    const linkedEvent = events.find(event =>
      event.sports && event.sports.some(s => s._id === sportId || s === sportId)
    );
    return linkedEvent ? linkedEvent.name : 'No event';
  };

  return (
    <div className="space-y-8">
      {/* Events Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Featured Events</h3>
        </div>
        {loading ? (
          <div className="flex justify-center py-6">Loading events...</div>
        ) : events.length === 0 ? (
          <p className="text-center py-6">No events available</p>
        ) : (
          <div className="flex overflow-x-auto pb-4 space-x-4">
            {events.map((event) => (
              <Card
                key={event._id}
                className="min-w-[300px] cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleEventClick(event._id)}
              >
                <div
                  className="h-20 bg-cover bg-center bg-muted"
                  style={{ backgroundImage: event.poster ? `url(${event.poster})` : 'none' }}
                >
                  {!event.poster && (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">{event.name}</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Sports Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Sports</h3>
        </div>
        {loading ? (
          <div className="flex justify-center py-6">Loading sports...</div>
        ) : sports.length === 0 ? (
          <p className="text-center py-6">No sports available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {sports.map((sport) => {
              const isDisabled = userRole === 'parent' && (sport.name === 'Cricket' || sport.name === 'Football');
              console.log(userRole)
              return (
                <Card
                  key={sport._id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => !isDisabled && handleSportClick(sport)}
                >
                  <div
                    className="h-40 bg-cover bg-center bg-muted"
                    style={{ backgroundImage: sport.image ? `url(${sport.image})` : 'none' }}
                  >
                    {!sport.image && (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">{sport.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{formatDate(sport.startDate)} - {formatDate(sport.endDate)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{sport.location || 'TBA'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Award className="h-4 w-4 mr-2" />
                        <span>{getEventNameBySportId(sport._id)}</span>
                      </div>
                      
                      {/* Country Selection */}
                      <div className="mt-3 space-y-1">
                        <Label htmlFor={`country-${sport._id}`} className="text-xs font-medium flex items-center">
                          <Globe className="h-3 w-3 mr-1" />
                          Country *
                        </Label>
                        <Select
                          value={selectedCountries[sport._id] || ''}
                          onValueChange={(value) => handleCountryChange(sport._id, value)}
                        >
                          <SelectTrigger 
                            id={`country-${sport._id}`}
                            className="h-8 text-xs"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{country.name}</span>
                                  <span className="text-xs text-gray-500 ml-2">{country.currency}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 pb-3">
                    <Button
                      className="w-full"
                      onClick={(e) => handleRegisterClick(sport, e)}
                    >
                      Register
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Sport Details Modal */}
      <Dialog open={sportDetailsOpen} onOpenChange={setSportDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedSport?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedSport?.image && (
              <div className="w-full h-20 rounded-md overflow-hidden">
                <img
                  src={selectedSport.image}
                  alt={selectedSport.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="text-base font-medium">Description</div>
              <p className="text-gray-700 dark:text-gray-300">
                {selectedSport?.description || 'No description available'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="space-y-2">
                  <div className="text-base font-medium">Event Detals</div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Award className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>{getEventNameBySportId(selectedSport?._id)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>{calculateDurationInDays(selectedSport?.startDate, selectedSport?.endDate)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="space-y-2">
                  <div className="text-base font-medium">Location</div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span>{selectedSport?.location || 'TBA'}</span>
                      </div>
                      <p className="ml-7 text-sm text-gray-600 dark:text-gray-400">
                        {selectedSport?.address || 'Address not available'}
                      </p>
                    </div>
                    {selectedSport?.mapsPin && (
                      <div className="ml-7">
                        <a
                          href={selectedSport.mapsPin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm flex items-center"
                        >
                          View on Google Maps
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                className="w-full"
                onClick={() => {
                  setSportDetailsOpen(false);
                  handleRegisterClick(selectedSport, { stopPropagation: () => {} });
                }}
              >
                Register for {selectedSport?.name}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>


    </div>
  );
}