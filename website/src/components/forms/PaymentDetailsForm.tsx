import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from '@/hooks/useToast';
import { ArrowLeft } from "lucide-react";

export function PaymentDetailsForm({
  onSubmit,
  onBack,
  onClose,
  sportName,
  price,
  participantCount,
  feeLabel = "Registration Fee" // Default label if not provided
}) {
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!paymentScreenshot) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload a payment screenshot"
      });
      return;
    }

    if (!transactionId.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a transaction ID"
      });
      return;
    }

    if (!termsAccepted) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please accept the terms and conditions"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(paymentScreenshot, transactionId, termsAccepted);
    } catch (error) {
      console.error("Error submitting payment details:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit payment details"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a JPG or PNG image"
        });
        e.target.value = ''; // Clear the input
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "Please upload an image smaller than 5MB"
        });
        e.target.value = ''; // Clear the input
        return;
      }

      setPaymentScreenshot(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="paymentInfo">{feeLabel}</Label>
          <div className="p-4 border rounded-md bg-muted/50">
            <p className="font-medium text-lg">{price} RS</p>
            {participantCount > 0 && (
              <p className="text-sm text-muted-foreground">
                For {participantCount} participant{participantCount > 1 ? 's' : ''}
              </p>
            )}
            <p className="text-sm mt-2">
              Please transfer the amount to the following account:
            </p>
            <div className="mt-2 space-y-1 text-sm">
              <p><span className="font-medium">Bank:</span> Emirates NBD</p>
              <p><span className="font-medium">Account Name:</span> Sports Zone</p>
              <p><span className="font-medium">Account Number:</span> 1234567890</p>
              <p><span className="font-medium">IBAN:</span> AE123456789012345678</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentScreenshot">Upload Payment Screenshot *</Label>
          <Input
            id="paymentScreenshot"
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileChange}
            required
          />
          {paymentScreenshot && (
            <p className="text-sm text-green-600">
              ✓ File selected: {paymentScreenshot.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="transactionId">Transaction ID / Reference Number *</Label>
          <Input
            id="transactionId"
            placeholder="Enter transaction ID"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(checked === true)}
          />
          <Label
            htmlFor="terms"
            className="text-sm font-normal"
          >
            I agree to the terms and conditions for sports registration
          </Label>
        </div>
      </div>

      <DialogFooter className="flex gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Complete Registration"}
        </Button>
      </DialogFooter>
    </form>
  );
}