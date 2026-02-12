import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddStudentForm } from "@/components/AddStudentForm";
import { EditStudentForm } from "@/components/EditStudentForm";
import { BulkUploadStudents } from "@/components/BulkUploadStudents";
import { getParentChildren } from '@/api/parent';
import { useToast } from '@/hooks/useToast';
import StudentTable from '@/components/StudentTable';
import SearchInput from '@/components/SearchInput';
import { ChevronLeft, ChevronRight, Plus, Upload } from "lucide-react";

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

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export function StudentsDashboard() {
  const [children, setChildren] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [addStudentDialogOpen, setAddStudentDialogOpen] = useState(false);
  const [bulkUploadDialogOpen, setBulkUploadDialogOpen] = useState(false);
  const [editStudentDialogOpen, setEditStudentDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const { toast } = useToast();

  const fetchChildren = useCallback(async (query: string) => {
    try {
      setLoading(true);
      const response = await getParentChildren({
        page: currentPage,
        limit: 10,
        search: query.trim()
      });

      if (response.children) {
        setChildren(response.children.map(student => ({
          ...student,
          dob: student.dob || null
        })));
      } else {
        setChildren([]);
      }

      if (response.pagination) {
        setPaginationInfo(response.pagination);
      }
    } catch (error: any) {
      console.error("Failed to fetch children:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load students"
      });
      setChildren([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, toast]);

  const handleSearch = useCallback((value: string) => {
    setCurrentPage(1);
    fetchChildren(value);
  }, [fetchChildren]);

  // Initial load
  useEffect(() => {
    fetchChildren('');
  }, [fetchChildren]);

  // Handle page changes
  useEffect(() => {
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (searchInput) {
      fetchChildren(searchInput.value);
    }
  }, [currentPage, fetchChildren]);

  const handleStudentAdded = () => {
    setAddStudentDialogOpen(false);
    fetchChildren('');
    toast({
      title: "Success",
      description: "Student added successfully"
    });
  };

  const handleAddStudentCancel = () => {
    setAddStudentDialogOpen(false);
  };

  const handleBulkUploadSuccess = () => {
    setBulkUploadDialogOpen(false);
    fetchChildren('');
    toast({
      title: "Success",
      description: "Students uploaded successfully"
    });
  };

  const handleBulkUploadCancel = () => {
    setBulkUploadDialogOpen(false);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setEditStudentDialogOpen(true);
  };

  const handleStudentUpdated = () => {
    setEditStudentDialogOpen(false);
    setSelectedStudent(null);
    fetchChildren('');
    toast({
      title: "Success",
      description: "Student updated successfully"
    });
  };

  const handleEditStudentCancel = () => {
    setEditStudentDialogOpen(false);
    setSelectedStudent(null);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= paginationInfo.totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Students</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setBulkUploadDialogOpen(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
          <Button onClick={() => setAddStudentDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <SearchInput
          onSearch={handleSearch}
          disabled={loading}
        />
      </div>

      <Card>
        <CardContent>
          <StudentTable
            students={children}
            loading={loading}
            onEdit={handleEditStudent}
          />
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Showing {((currentPage - 1) * paginationInfo.itemsPerPage) + 1} to{" "}
          {Math.min(currentPage * paginationInfo.itemsPerPage, paginationInfo.totalItems)} of{" "}
          {paginationInfo.totalItems} students
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {paginationInfo.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === paginationInfo.totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add Student Dialog */}
      <Dialog open={addStudentDialogOpen} onOpenChange={setAddStudentDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new student
            </DialogDescription>
          </DialogHeader>
          <AddStudentForm
            onSuccess={handleStudentAdded}
            onCancel={handleAddStudentCancel}
          />
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Dialog */}
      <Dialog open={bulkUploadDialogOpen} onOpenChange={setBulkUploadDialogOpen}>
        <DialogContent className="max-w-7xl w-[95vw] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Bulk Upload Students</DialogTitle>
            <DialogDescription>
              Upload multiple students at once using an Excel file
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-auto">
            <BulkUploadStudents
              onSuccess={handleBulkUploadSuccess}
              onCancel={handleBulkUploadCancel}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={editStudentDialogOpen} onOpenChange={setEditStudentDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Update student information
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <EditStudentForm
              student={selectedStudent}
              onSuccess={handleStudentUpdated}
              onCancel={handleEditStudentCancel}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}