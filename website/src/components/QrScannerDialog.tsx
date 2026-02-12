import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { QrScanner } from "./QrScanner"
import { useToast } from "@/hooks/useToast"
import { verifyAttendance } from "@/api/attendance"
import { useState, useEffect } from "react"

interface QrScannerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  checkpoint: string
  onSuccess?: (studentData: any) => void
}

export function QrScannerDialog({ open, onOpenChange, checkpoint, onSuccess }: QrScannerDialogProps) {
  const { toast } = useToast()
  const [isVerifying, setIsVerifying] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [verificationStep, setVerificationStep] = useState<string>('')

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setIsVerifying(false)
      setScanResult(null)
      setVerificationStep('')
    }
  }, [open])

  // Auto-close verification modal after success or error
  useEffect(() => {
    if (!isVerifying || !scanResult) return;
  
    const processAttendance = async () => {
      try {
        setVerificationStep('Getting location...')
        
        const response = await verifyAttendance({
          studentId: scanResult,
          checkpoint,
          location: undefined,
        });
  
        if (response.success) {
          // Check location status and provide appropriate feedback
          let description = `Attendance marked for ${response.student.name} at ${checkpoint}`;
          
          if (response.locationStatus) {
            switch (response.locationStatus) {
              case 'valid':
                description += ' with location captured successfully.';
                break;
              case 'zero_coordinates':
              case 'invalid_coordinates':
              case 'invalid_type':
              case 'missing':
                description += ' (Location capture failed - attendance recorded without location)';
                toast({
                  title: "Location Warning",
                  description: "Attendance recorded but location could not be captured. Please check your device location settings.",
                  className: "bg-yellow-500 text-white",
                });
                break;
              default:
                description += '.';
            }
          }
          
          toast({
            title: "Success",
            description: description,
            className: "bg-green-500 text-white",
          });
  
          onSuccess?.(response.student);
        }
      } catch (error: any) {
        const errorMsg = error.message || "Failed to process attendance";
        
        // Handle location-specific errors
        if (errorMsg.includes('Location') || errorMsg.includes('location')) {
          toast({
            title: "Location Error",
            description: "Unable to capture location. Please check your device location settings and try again.",
            className: "bg-yellow-500 text-white",
          });
        } else if (errorMsg.includes("not found")) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Invalid QR code: Student not found",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: errorMsg,
          });
        }
      } finally {
        // Reset state before allowing new scans
        setIsVerifying(false);
        setScanResult(null);
        setVerificationStep('');
        
        // Close dialog after a short delay
        setTimeout(() => {
          onOpenChange(false);
        }, 1000);
      }
    };
  
    processAttendance();
  }, [isVerifying, scanResult, checkpoint, toast, onOpenChange, onSuccess]);
  
  const handleScan = (result: string) => {
    if (isVerifying || !result || result === scanResult) return; // Prevent duplicate scans
  
    setIsVerifying(true);
    setScanResult(result);
  };
  
  const handleError = (error: string) => {
    toast({
      variant: "destructive",
      title: "Scanner Error",
      description: error,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Scan Student QR Code
          </DialogTitle>
          <DialogDescription>
            Position the QR code within the camera frame to scan. Location will be captured automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          {open && !isVerifying && <QrScanner onScan={handleScan} onError={handleError} />}
          {isVerifying && (
            <div className="flex flex-col items-center justify-center p-4 space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {verificationStep || "Verifying attendance..."}
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}