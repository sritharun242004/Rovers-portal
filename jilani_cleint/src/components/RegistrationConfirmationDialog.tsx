import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface RegistrationConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
  sportName: string;
  isGroup: boolean;
  studentCount?: number;
}

export function RegistrationConfirmationDialog({
  open,
  onOpenChange,
  studentName,
  sportName,
  isGroup,
  studentCount = 0
}: RegistrationConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center justify-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <DialogTitle className="text-xl text-center">Registration Confirmed!</DialogTitle>
          <DialogDescription className="text-center text-base">
            {isGroup ? (
              <span>Your group of <strong>{studentCount}</strong> students has been successfully registered for <strong>{sportName}</strong>.</span>
            ) : (
              <span><strong>{studentName}</strong> has been successfully registered for <strong>{sportName}</strong>.</span>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md my-4">
          <p className="text-sm text-center">
            A confirmation email has been sent to your registered email address with all the details.
          </p>
        </div>
        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full bg-green-500 hover:bg-green-600"
          >
            Great!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}