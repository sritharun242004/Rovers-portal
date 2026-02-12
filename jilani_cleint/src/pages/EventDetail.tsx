import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Clock, Award, Loader2 } from 'lucide-react';
import { getEventById } from '@/api/events';
import { getSportsForEvent } from '@/api/sports';
import { useToast } from '@/hooks/useToast';
import { SportRegistrationForm } from '@/components/SportRegistrationForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';

interface Event {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  poster?: string;
  country: string;
}

interface Sport {
  _id: string;
  id?: string;
  name: string;
  description?: string;
  image?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  address?: string;
  mapsPin?: string;
  duration?: string;
}

export function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { toast } = useToast();
  const DEFAULT_IMAGE = 'https://via.placeholder.com/300x200?text=Sport';
  const { userRole } = useAuth();

  console.log('EventDetail Component Rendered', { id, userRole });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // Fetch event details and sports
        const [eventResponse, sportsResponse] = await Promise.all([
          getEventById(id),
          getSportsForEvent(id)
        ]);

        console.log('Event Response:', eventResponse);
        console.log('Sports Response:', sportsResponse);

        if (eventResponse && eventResponse.event) {
          setEvent(eventResponse.event);
        } else {
          throw new Error('Event data not found in response');
        }
        
        if (sportsResponse && sportsResponse.sports) {
          setSports(sportsResponse.sports);
        } else {
          console.warn('No sports data in response, setting empty array');
          setSports([]);
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load event details. Please check your connection and try again.';
        setError(errorMessage);
        setEvent(null);
        setSports([]);
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, toast]);

  // Add console log when sports state changes
  useEffect(() => {
    console.log('Current Sports State:', sports);
  }, [sports]);

  const handleSportClick = (sport: Sport) => {
    if (!sport) return;
    setSelectedSport(sport);
    setShowDetailsModal(true);
  };

  const handleRegisterClick = (sport: Sport, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // Prevent the card click event
    }

    if (!sport || !sport._id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Sport information is missing. Please try again."
      });
      return;
    }

    if (!event || !event.country) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Event country information is missing. Please try again."
      });
      return;
    }

    // Navigate to student selection page with event's country
    navigate(`/event/${id}/student-selection?sportId=${sport._id}&sportName=${encodeURIComponent(sport.name)}&country=${event.country}`);
  };

  const handleRegistrationSuccess = () => {
    toast({
      title: "Success",
      description: "Registration completed successfully!"
    });
    setRegisterDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setRegisterDialogOpen(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="w-full py-10">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading event details...</p>
          <p className="text-sm text-gray-500 mt-2">Event ID: {id}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-10">
        <div className="text-center">
          <p className="text-lg mb-2 text-red-600">Error Loading Event</p>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
            <Link to="/parent">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="w-full py-10">
        <div className="text-center">
          <p className="text-lg mb-4">Event not found</p>
          <p className="text-sm text-gray-500 mb-4">Event ID: {id}</p>
        <Link to="/parent">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        </div>
      </div>
    );
  }

  // Filter out null values from sports array before any processing
  const filteredSports = sports.filter(sport => sport !== null);

  // Add console log in the render section
  console.log('Filtered Sports:', filteredSports);
  console.log('Event Data:', event);

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center">
        <Link to="/parent">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold ml-4">{event.name}</h1>
      </div>

      <div className="relative w-full h-[200px] md:h-[300px] rounded-lg overflow-hidden">
        <img
          src={event.poster || 'https://via.placeholder.com/1200x300?text=Event+Banner'}
          alt={event.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="prose max-w-none dark:prose-invert">
        <p>{event.description}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Calendar className="h-5 w-5 mr-2" />
          <span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Sports in this Event</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredSports.length > 0 ? (
            filteredSports.map((sport, index) => {
              const isDisabled = userRole === 'parent' && (sport.name === 'Cricket' || sport.name === 'Football');
              return (
                <Card
                  key={sport?._id || `sport-${index}`}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => !isDisabled && sport && handleSportClick(sport)}
                >
                  <div
                    className="h-40 bg-cover bg-center bg-muted"
                    style={{
                      backgroundImage: sport?.image ? `url("${sport.image}")` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {!sport?.image && (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>
                  <CardHeader className="py-3">
                    <CardTitle className="text-lg">{sport?.name || 'Unnamed Sport'}</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{formatDate(sport?.startDate)} - {formatDate(sport?.endDate)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{sport?.location || 'TBA'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Award className="h-4 w-4 mr-2" />
                        <span>{event?.name || 'Event'}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 pb-3">
                    <Button
                      className="w-full"
                      onClick={(e) => handleRegisterClick(sport, e)}
                      disabled={isDisabled}
                    >
                      Register
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          ) : (
            <div className="text-center col-span-full py-6">
              <p className="text-muted-foreground">No sports available for this event.</p>
            </div>
          )}
        </div>
      </div>

      {/* Sport Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedSport?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {selectedSport?.image && (
              <div className="w-full h-40 rounded-md overflow-hidden">
                <img
                  src={selectedSport.image}
                  alt={selectedSport.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="text-base font-medium">Description</div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {selectedSport?.description || 'No description available'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="space-y-2">
                  <div className="text-base font-medium">Event Details</div>
                  <div className="space-y-1.5">
                    <div className="flex items-center text-sm">
                      <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{event.name}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{selectedSport?.duration || 'TBA'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="space-y-2">
                  <div className="text-base font-medium">Location</div>
                  <div className="space-y-1.5">
                    <div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{selectedSport?.location || 'TBA'}</span>
                      </div>
                      <p className="ml-6 text-xs text-gray-600 dark:text-gray-400">
                        {selectedSport?.address || 'Address not available'}
                      </p>
                    </div>
                    {selectedSport?.mapsPin && (
                      <div className="ml-6">
                        <a
                          href={selectedSport.mapsPin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-xs flex items-center"
                        >
                          View on Google Maps
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                className="w-full"
                onClick={() => {
                  const sportId = selectedSport?.id || selectedSport?._id;
                  
                  if (!event || !event.country) {
                    toast({
                      variant: "destructive",
                      title: "Error",
                      description: "Event country information is missing. Please try again."
                    });
                    return;
                  }
                  
                  setShowDetailsModal(false);
                  navigate(`/event/${id}/student-selection?sportId=${sportId}&sportName=${encodeURIComponent(selectedSport?.name || '')}&country=${event.country}`);
                }}
              >
                Register for {selectedSport?.name}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <SportRegistrationForm
        open={registerDialogOpen}
        onOpenChange={setRegisterDialogOpen}
        sportId={selectedSport?.id || selectedSport?._id}
        sportName={selectedSport?.name}
        eventId={id}
        onSuccess={handleRegistrationSuccess}
        onClose={handleCloseDialog}
      />
    </div>
  );
}