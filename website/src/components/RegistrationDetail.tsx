import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { getDetailedRegistrationInfo } from '@/api/registration';
import { useToast } from '@/hooks/useToast';
import { ArrowLeft, MapPin, Calendar, Users, Award } from 'lucide-react';
import { format } from 'date-fns';

// Utility function to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return format(date, 'dd-MMM-yyyy');
};

export function RegistrationDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        if (!id) {
          toast({
            title: "Error",
            description: "Registration ID is required",
            variant: "destructive",
          });
          navigate('/parent/registrations');
          return;
        }

        const response = await getDetailedRegistrationInfo(id);
        if (response.success) {
          setDetails(response);
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to fetch registration details",
            variant: "destructive",
          });
          navigate('/parent/registrations');
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch registration details",
          variant: "destructive",
        });
        navigate('/parent/registrations');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, toast, navigate]);

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: "bg-yellow-500",
      approved: "bg-green-500",
      rejected: "bg-red-500"
    };

    return (
      <Badge className={`${statusColors[status] || "bg-gray-500"} text-white`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" className="mr-2" onClick={() => navigate('/parent/registrations')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Skeleton className="h-8 w-[200px]" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/parent/registrations')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Registrations
        </Button>
        <Card>
          <CardContent className="p-6 text-center">
            <p>Registration details not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { registration, participants, location, address, paymentScreenshot } = details;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/parent/registrations')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Registrations
        </Button>
        {/* {getStatusBadge(registration.status)} */}
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-2xl">
            {registration.sport?.name || 'N/A'} - {registration.student.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Event Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="font-medium">Event:</span>
                  <span>{registration.event?.name || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-medium">Start Date:</span>
                  <span>{formatDate(registration.sport?.startDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-medium">End Date:</span>
                  <span>{formatDate(registration.sport?.endDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Age Category:</span>
                  <span>{registration.ageCategory?.ageGroup || "N/A"}</span>
                </div>
                {registration.distance && registration.distance.category && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Distance:</span>
                    <span>{registration.distance.category}</span>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold mt-6">Location Information</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Location:</p>
                    <p>{location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Address:</p>
                    <p>{address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* {paymentScreenshot && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Payment Proof</h3>
                  <div className="border rounded-md overflow-hidden">
                    <img
                      src={paymentScreenshot}
                      alt="Payment Screenshot"
                      className="w-full h-auto object-contain max-h-[300px]"
                    />
                  </div>
                </div>
              )} */}

              {registration.isGroupRegistration && participants.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <h3 className="text-lg font-semibold">Participants ({participants.length})</h3>
                  </div>
                  <ul className="space-y-2 max-h-[300px] overflow-y-auto border rounded-md p-3">
                    {participants.map((participant, index) => (
                      <li key={participant._id} className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200">
                          {participant.photo ? (
                            <img
                              src={participant.photo}
                              alt={participant.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-500">
                              {index + 1}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{participant.name}</p>
                          <p className="text-sm text-gray-500">ID: {participant.uid}</p>
                        </div>
                        {participant.isSubstitute && (
                          <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full ml-auto">
                            Substitute
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}