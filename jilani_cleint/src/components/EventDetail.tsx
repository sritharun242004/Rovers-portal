import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar, MapPin, Award } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { getEvent, getSportsForEvent } from "@/api/events";
import { EventType, SportType } from "@/types";
import { format } from "date-fns";
import { Skeleton } from "./ui/skeleton";
import ErrorDisplay from "./common/ErrorDisplay";

const EventDetail: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [event, setEvent] = useState<EventType | null>(null);
  const [sports, setSports] = useState<SportType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        if (!eventId) {
          throw new Error("Event ID is required");
        }

        // Fetch event details
        const eventData = await getEvent(eventId);
        setEvent(eventData);

        // Fetch sports for the event
        const sportsData = await getSportsForEvent(eventId);
        setSports(sportsData);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load event details");
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load event details"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, toast]);

  const formatDate = (date: string | Date | null | undefined): string => {
    if (!date) return "TBA";
    try {
      return format(new Date(date), "MMM dd, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const handleSportClick = (sport: SportType) => {
    navigate(`/events/${eventId}/sports/${sport._id}`);
  };

  const handleRegisterClick = (sport: SportType, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card onClick from triggering
    navigate(`/events/${eventId}/sports/${sport._id}/register`);
  };
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-6 w-1/3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (!event) {
    return <ErrorDisplay message="Event not found" />;
  }
  const filteredSports = sports.filter(sport => sport !== null);
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
        <p className="text-gray-500 mb-2">
          {formatDate(event.startDate)} - {formatDate(event.endDate)}
        </p>
        <p className="text-gray-700">{event.description || "No description available."}</p>
      </div>

      <h2 className="text-2xl font-semibold mb-6">Sports & Activities</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSports.length > 0 ? (
          filteredSports.map((sport) => (
            <Card
              key={sport._id || Math.random().toString()}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleSportClick(sport)}
            >
              <div
                className="h-40 bg-cover bg-center bg-muted"
                style={{ backgroundImage: sport?.image ? `url(${sport.image})` : 'none' }}
              >
                {!sport?.image ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                ) : null}
              </div>
              <CardHeader className="py-3">
                <CardTitle className="text-lg">{sport?.name || 'Unknown Sport'}</CardTitle>
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
                    <span>{event.name}</span>
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
          ))
        ) : (
          <div className="text-center col-span-full py-6">
            <p className="text-muted-foreground">No sports available for this event.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetail;