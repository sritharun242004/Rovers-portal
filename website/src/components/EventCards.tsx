import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { getEvents } from "@/api/events";
import { useToast } from "@/hooks/useToast";
import { Calendar, Globe } from "lucide-react";

interface Event {
    _id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    poster?: string;
    country: string;
}

export function EventCards() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const eventsResponse = await getEvents();
                setEvents(eventsResponse.events || []);
            } catch (error: any) {
                console.error('Error fetching events:', error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error?.message || 'An error occurred while loading events'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [toast]);

    const handleEventClick = (eventId: string) => {
        navigate(`/event/${eventId}`);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'TBA';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base">{event.name}</CardTitle>
                                        <Badge variant="secondary" className="flex items-center gap-1">
                                            <Globe className="h-3 w-3" />
                                            {event.country}
                                        </Badge>
                                    </div>
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
        </div>
    );
} 