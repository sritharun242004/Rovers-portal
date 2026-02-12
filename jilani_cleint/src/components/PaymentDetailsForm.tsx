import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Copy, Check } from 'lucide-react';
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/useToast";

interface PaymentDetailsFormProps {
  onSubmit: (paymentScreenshot: File, transactionId: string, termsAccepted: boolean) => Promise<void>;
  onBack: () => void;
  onClose?: () => void;
  sportName: string;
  price: number;
  participantCount: number;
}

export function PaymentDetailsForm({
  onSubmit,
  onBack,
  onClose,
  sportName,
  price,
  participantCount
}: PaymentDetailsFormProps) {
  const [transactionId, setTransactionId] = useState('');
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [copyStatus, setCopyStatus] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [loading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (!selectedFile.type.includes('image')) {
        setError('Please upload an image file');
        setPaymentFile(null);
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size should be less than 5MB');
        setPaymentFile(null);
        return;
      }

      setError('');
      setPaymentFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!transactionId.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Transaction ID is required"
      });
      setIsLoading(false);
      return;
    }

    if (!paymentFile) {
      setError('Please upload a payment screenshot');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload a payment screenshot"
      });
      setIsLoading(false);
      return;
    }

    if (!termsAccepted) {
      setError('Please accept the terms and conditions');
      setIsLoading(false);
      return;
    }

    try {
      await onSubmit(paymentFile, transactionId, termsAccepted);
    } catch (error) {
      console.error('Error submitting payment details:', error);
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        // For modern browsers with clipboard API support
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
      }
    } catch (error) {
      console.error('Failed to copy text: ', error);
      return false;
    }
  };

  const handleCopy = async (text: string, id: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      // Set copy status for this specific account
      setCopyStatus(prev => ({ ...prev, [id]: true }));

      // Show success toast
      toast({
        title: "Copied!",
        description: "Account number copied to clipboard"
      });

      // Reset the copy status after 2 seconds
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [id]: false }));
      }, 2000);
    } else {
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Could not copy to clipboard"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6 pt-2 overflow-y-auto pb-6">
        <div className="bg-muted p-4 rounded-lg text-center mb-4">
          <p className="text-sm text-muted-foreground mb-1">Registration Fee</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            RS {price}
          </p>
          <p className="text-sm text-muted-foreground">Number of Participants: {participantCount}</p>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md mb-4">
            <h4 className="text-sm font-medium mb-2">Bank Account Details</h4>
            <div className="text-sm space-y-1">
              <div className="flex items-center space-x-2">
                <p><span className="font-medium">Account No:</span> 13312306820001</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleCopy("13312306820001", "account1")}
                >
                  {copyStatus["account1"] ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p><span className="font-medium">Account Name:</span> TOPTEKKER SPORTS SERVICES CO LLC</p>
              <p><span className="font-medium">Bank:</span> Abu Dhabi Commerical Bank</p>
              <p><span className="font-medium">Branch Code / Branch Name:</span> 752 / IBD-AL Karamah Branch</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Please transfer the amount to the above account and upload the payment screenshot below.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="screenshot">Payment Screenshot *</Label>
            <Input
              id="screenshot"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="cursor-pointer"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            {paymentFile && <p className="text-sm text-green-500">File selected: {paymentFile.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="transactionId">Transaction ID *</Label>
            <Input
              id="transactionId"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter transaction ID"
              required
            />
          </div>

          <div className="space-y-4 mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms1"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked === true)}
              />
              <label
                htmlFor="terms1"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I accept the Terms and Conditions
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms2"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked === true)}
              />
              <label
                htmlFor="terms2"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I understand the registration policy
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms3"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked === true)}
              />
              <label
                htmlFor="terms3"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I confirm that all provided information is accurate
              </label>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter className="mt-6 pt-4 sticky bottom-0 bg-background border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={loading}
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={loading || !termsAccepted}
          className="w-full bg-green-500 hover:bg-green-600"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Complete Registration"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}