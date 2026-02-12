import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { getParentRegistrations } from '@/api/registration';
import { useToast } from '@/hooks/useToast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface Registration {
  _id: string;
  student: {
    _id: string;
    name: string;
    photo: string;
    uid: string;
    dob: string;
  };
  sport: {
    _id: string;
    name: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    address?: string;
  };
  event?: {
    _id: string;
    name: string;
  };
  ageCategory?: {
    _id: string;
    ageGroup: string;
  };
  distance?: {
    _id: string;
    category: string;
  };
  status: string;
  paymentScreenshot?: string;
  isGroupRegistration: boolean;
  groupRegistrationId?: string;
}

// Utility function to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return format(date, 'dd-MMM-yyyy');
};

export function MyRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const data = await getParentRegistrations();
        if (data.success) {
          setRegistrations(data.registrations);
        } else {
          toast({
            title: "Error",
            description: data.message || "Failed to fetch registrations",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching registrations:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to fetch registrations",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [toast]);

  const handleRegistrationClick = (registrationId) => {
    navigate(`/registration-details/${registrationId}`);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">My Registrations</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (registrations.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">My Registrations</h2>
        <Card>
          <CardContent className="p-6 text-center">
            <p>No registrations found. Register for a sport to see it here.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">My Registrations</h2>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Sport</TableHead>
              <TableHead>Date Range</TableHead>
              <TableHead>Age Category</TableHead>
              <TableHead>Type</TableHead>
              {/* No student name column as per requirements */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((registration) => (
              <TableRow
                key={registration._id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleRegistrationClick(registration._id)}
              >
                <TableCell className="font-medium">{registration.event?.name || "N/A"}</TableCell>
                <TableCell className="text-blue-600 dark:text-blue-400">
                  {registration.sport?.name || "N/A"}
                </TableCell>
                <TableCell>
                  {formatDate(registration.sport?.startDate)} - {formatDate(registration.sport?.endDate)}
                </TableCell>
                <TableCell>{registration.ageCategory?.ageGroup || "N/A"}</TableCell>
                <TableCell>
                  {registration.isGroupRegistration ? (
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      Group
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Individual
                    </Badge>
                  )}
                  {registration.distance && (
                    <Badge variant="outline" className="ml-2 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                      {registration.distance.category}
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}