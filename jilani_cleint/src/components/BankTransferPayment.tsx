import React, { useState, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, Building2, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { formatAmount } from '@/api/payment';

interface BankTransferPaymentProps {
    open: boolean;
    onClose: () => void;
    amount: number;
    currency: string;
    studentIds: string[];
    eventId?: string | null;
    sportId?: string;
    sportName?: string;
    onSuccess: (paymentDetails: any) => void;
}

const BANK_DETAILS = {
    bankName: 'RHB Bank',
    accountNumber: '21405300130686',
    accountName: 'TOP TEKKER SPORTS SERVICES SDN BHD'
};

export default function BankTransferPayment({
    open,
    onClose,
    amount,
    currency,
    studentIds,
    eventId,
    sportId,
    sportName,
    onSuccess
}: BankTransferPaymentProps) {
    const { toast } = useToast();
    const [academyCode, setAcademyCode] = useState('');
    const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast({
                    variant: 'destructive',
                    title: 'Invalid File',
                    description: 'Please upload an image file (JPG, PNG, etc.)'
                });
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    variant: 'destructive',
                    title: 'File Too Large',
                    description: 'Please upload an image smaller than 5MB'
                });
                return;
            }

            setScreenshotFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setScreenshotPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCopyAccountNumber = () => {
        navigator.clipboard.writeText(BANK_DETAILS.accountNumber);
        setCopied(true);
        toast({
            title: 'Copied!',
            description: 'Account number copied to clipboard'
        });
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async () => {
        if (!screenshotFile) {
            toast({
                variant: 'destructive',
                title: 'Payment Screenshot Required',
                description: 'Please upload a screenshot of your payment transaction'
            });
            return;
        }

        setUploading(true);

        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('paymentScreenshot', screenshotFile);
            
            // Handle studentIds - send as JSON string for consistency with backend
            formData.append('studentIds', JSON.stringify(studentIds));
            
            if (academyCode) {
                formData.append('academyCode', academyCode);
            }
            if (eventId) {
                formData.append('eventId', eventId);
            }
            if (sportId) {
                formData.append('sportId', sportId);
            }
            formData.append('paymentMethod', 'bank_transfer');

            // Upload payment screenshot and register students
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/registration/register`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to process payment');
            }

            toast({
                title: 'Payment Submitted!',
                description: 'Your payment screenshot has been uploaded. Registration will be confirmed after verification.'
            });

            onSuccess({
                paymentMethod: 'bank_transfer',
                amount,
                currency,
                academyCode,
                paymentScreenshot: data.paymentScreenshot,
                registrationData: data
            });

            onClose();
        } catch (error: any) {
            console.error('Payment submission error:', error);
            toast({
                variant: 'destructive',
                title: 'Submission Failed',
                description: error.message || 'Failed to submit payment. Please try again.'
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Bank Transfer Payment</DialogTitle>
                    <DialogDescription>
                        Please transfer the amount to the bank account below and upload your payment screenshot
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Amount to Pay */}
                    <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold text-gray-700">Amount to Pay:</span>
                                <span className="text-2xl font-bold text-blue-600">
                                    {formatAmount(amount, currency)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bank Account Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Account Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-500">Bank Name</Label>
                                <div className="p-3 bg-gray-50 rounded-md border">
                                    <span className="font-semibold">{BANK_DETAILS.bankName}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-500">Account Number</Label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 p-3 bg-gray-50 rounded-md border font-mono">
                                        {BANK_DETAILS.accountNumber}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCopyAccountNumber}
                                        className="flex items-center gap-2"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="h-4 w-4" />
                                                Copied
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-4 w-4" />
                                                Copy
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-500">Account Name</Label>
                                <div className="p-3 bg-gray-50 rounded-md border">
                                    <span className="font-semibold">{BANK_DETAILS.accountName}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Academy/School Code (Optional) */}
                    <div className="space-y-2">
                        <Label htmlFor="academyCode">
                            Your Academy/School Code <span className="text-gray-400 text-sm">(Optional)</span>
                        </Label>
                        <Input
                            id="academyCode"
                            type="text"
                            placeholder="Enter your academy or school code"
                            value={academyCode}
                            onChange={(e) => setAcademyCode(e.target.value)}
                        />
                        <p className="text-sm text-gray-500">
                            If you have an academy or school code, please enter it here
                        </p>
                    </div>

                    {/* Payment Screenshot Upload */}
                    <div className="space-y-2">
                        <Label htmlFor="paymentScreenshot">
                            Payment Screenshot <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-3">
                            <Input
                                id="paymentScreenshot"
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full"
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                {screenshotFile ? 'Change Screenshot' : 'Upload Payment Screenshot'}
                            </Button>
                            
                            {screenshotFile && (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-600 mb-2">
                                        Selected: {screenshotFile.name} ({(screenshotFile.size / 1024).toFixed(2)} KB)
                                    </p>
                                    {screenshotPreview && (
                                        <div className="mt-2 border rounded-md p-2 bg-gray-50">
                                            <img
                                                src={screenshotPreview}
                                                alt="Payment screenshot preview"
                                                className="max-w-full h-auto max-h-64 rounded-md"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-gray-500">
                            Please upload a clear screenshot of your bank transfer transaction
                        </p>
                    </div>

                    {/* Info Alert */}
                    <Alert>
                        <AlertDescription>
                            <strong>Important:</strong> After transferring the amount, please upload a screenshot of your payment transaction. 
                            Your registration will be confirmed after we verify your payment.
                        </AlertDescription>
                    </Alert>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                            disabled={uploading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            className="flex-1"
                            disabled={uploading || !screenshotFile}
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                'Submit Payment'
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

