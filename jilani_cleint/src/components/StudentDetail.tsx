import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { getStudentById } from '@/api/parent';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';

interface Student {
  _id: string;
  name: string;
  uid: string;
  sport: {
    _id: string;
    name: string;
  };
  event?: {
    _id: string;
    name: string;
  };
  ageCategory?: {
    _id: string;
    name: string;
  };
  distance?: {
    _id: string;
    name: string;
  };
  sportSubType?: {
    _id: string;
    name: string;
  };
  nationality?: string;
  nationalityCode?: string;
}

const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await getStudentById(id);
          setStudent(data);
        }
      } catch (error) {
        console.error('Failed to fetch student details:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to load student details',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Student Not Found</CardTitle>
            <CardDescription>The requested student data could not be found.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{student.name}</CardTitle>
          <CardDescription>UID: {student.uid}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Sport</h3>
              <p>{student.sport?.name || 'Not assigned'}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium">Sport Sub Type</h3>
              <p>{student.sportSubType?.name || 'Not assigned'}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium">Event</h3>
              <p>{student.event?.name || 'Not assigned'}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium">Age Category</h3>
              <p>{student.ageCategory?.name || 'Not assigned'}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium">Distance</h3>
              <p>{student.distance?.name || 'Not assigned'}</p>
            </div>
            {student.nationality && (
              <div>
                <h3 className="text-lg font-medium">Nationality</h3>
                <p>{student.nationality}</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Students
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StudentDetail;