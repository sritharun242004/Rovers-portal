import { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Edit, Pencil } from "lucide-react";

interface Student {
  _id: string;
  name: string;
  uid: string;
  sport: string;
  location: string;
  status: string;
  photo: string;
  dob: string | null;
  gender: string;
  nationality: string;
  city: string;
  represents: string;
  class: string;
  bloodGroup: string;
  relationship: string;
  isRegistered?: boolean;
  registrationCount?: number;
}

interface StudentTableProps {
  students: Student[];
  loading: boolean;
  onEdit: (student: Student) => void;
}

export default function StudentTable({ students, loading, onEdit }: StudentTableProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not available';

    try {
      const date = new Date(dateString);
      return format(date, "do MMMM yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid date';
    }
  };

  const handleRowClick = (studentId: string) => {
    navigate(`/parent/students/${studentId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <p>Loading students...</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="flex items-center justify-center p-6">
        <p className="text-muted-foreground">No students found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border shadow-sm overflow-hidden">
      <Table>
        <TableCaption>List of your students</TableCaption>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[180px]">Name</TableHead>
            <TableHead className="w-[100px]">Photo</TableHead>
            <TableHead className="w-[180px]">Date of Birth</TableHead>
            <TableHead>Registration Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow
              key={student._id}
              className="cursor-pointer hover:bg-muted/30"
              onClick={() => handleRowClick(student._id)}
            >
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>
                <Avatar className="h-12 w-12">
                  <AvatarImage src={student.photo} alt={student.name} />
                  <AvatarFallback className="text-lg">{student.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{formatDate(student.dob)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {student.isRegistered ? (
                    <>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Registered
                      </span>
                      {student.registrationCount && student.registrationCount > 1 && (
                        <span className="text-xs text-gray-500">
                          ({student.registrationCount} sports)
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Not Registered
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(student);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}