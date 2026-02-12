import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/useToast';
import { Camera, Edit } from 'lucide-react';
import { uploadStudentPhoto } from '@/api/parent';
import { EditStudentForm } from './EditStudentForm';

// Sport colors for badges
const sportColors = {
  'Football': 'bg-blue-500',
  'Cricket': 'bg-green-500',
  'Basketball': 'bg-purple-500',
  'Tennis': 'bg-orange-500',
  'Hockey': 'bg-red-500',
  'default': 'bg-gray-500'
};

export function StudentsList({ children, onSuccess }) {
  const [selectedChild, setSelectedChild] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setPhotoLoading(true);
      await uploadStudentPhoto(selectedChild._id, file);
      toast({
        title: "Success",
        description: "Photo uploaded successfully!"
      });
      setPhotoDialogOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleEditSuccess = (updatedStudent) => {
    setEditDialogOpen(false);
    if (onSuccess) onSuccess();
    toast({
      title: "Success",
      description: "Student information updated successfully!"
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';

    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const getSportColor = (sport) => {
    return sportColors[sport] || sportColors.default;
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {children.map((child) => (
        <Card key={child._id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative">
                  <Avatar className="h-24 w-24 mr-4">
                    <AvatarImage src={child.photo} alt={child.name} />
                    <AvatarFallback className="text-2xl">{child.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button
                    variant="outline"
                    className="absolute bottom-0 right-0 text-xs"
                    style={{ backgroundColor: "#ffffff", color: "#2961b6" }}
                    onClick={() => {
                      setSelectedChild(child);
                      setPhotoDialogOpen(true);
                    }}
                  >
                    <Camera className="h-4 w-4 mr-1" />
                    Upload Photo
                  </Button>
                </div>
                <div>
                  <span className="text-2xl">{child.name}</span>
                  <p className="text-muted-foreground text-sm">
                    {child.uid}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Badge className={`${getSportColor(child.sport)} text-md px-3 py-1 flex items-center justify-center self-end`}>
                  {child.sport}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="self-end"
                  onClick={() => {
                    setSelectedChild(child);
                    setEditDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Student
                </Button>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4 text-lg mb-6">
              <div className="text-muted-foreground">Date of Birth:</div>
              <div className="font-medium">{formatDate(child.dob)}</div>

              <div className="text-muted-foreground">Sport Category:</div>
              <div className="font-medium">{child.sport}</div>

              <div className="text-muted-foreground">Event:</div>
              <div className="font-medium">{child.inlineCategory || 'Not assigned'}</div>

              <div className="text-muted-foreground">Aadhaar / Emirates ID:</div>
              <div className="font-medium">{child.uid}</div>

              <div className="text-muted-foreground">Class:</div>
              <div className="font-medium">{child.class}</div>

              <div className="text-muted-foreground">Represents:</div>
              <div className="font-medium">{child.represents || 'Not specified'}</div>
            </div>
            <Button
              className="w-full mt-4 text-lg py-6"
              onClick={() => {
                setSelectedChild(child);
                setEditDialogOpen(true);
              }}
            >
              Edit Student Information
            </Button>
          </CardContent>
        </Card>
      ))}

      {/* Photo Upload Dialog */}
      <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Photo</DialogTitle>
            <DialogDescription>
              {selectedChild ? `Upload a new photo for ${selectedChild.name}` : 'Please select a student first'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center justify-center gap-4">
              {selectedChild?.photo && (
                <Avatar className="h-32 w-32">
                  <AvatarImage src={selectedChild.photo} alt={selectedChild.name} />
                  <AvatarFallback className="text-4xl">{selectedChild?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              )}

              <label htmlFor="photo-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 p-2 border rounded bg-secondary hover:bg-secondary/80">
                  <Camera className="h-4 w-4" />
                  <span>Upload Photo</span>
                </div>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                />
              </label>
              {photoLoading && <p className="text-sm text-center">Uploading...</p>}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPhotoDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit Student Information</DialogTitle>
            <DialogDescription>
              {selectedChild ? `Update information for ${selectedChild.name}` : 'Please select a student first'}
            </DialogDescription>
          </DialogHeader>
          {selectedChild && (
            <EditStudentForm
              student={selectedChild}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}