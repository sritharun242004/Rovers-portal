import React, { useState, useRef, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Banknote, Upload, Loader2, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { calculatePricing } from '@/api/payment';

const BANK_DETAILS = {
    bankName: 'RHB Bank',
    accountNumber: '21405300130686',
    accountName: 'TOP TEKKER SPORTS SERVICES SDN BHD'
};

interface RegistrationPaymentModalProps {
    open: boolean;
    onClose: () => void;
    studentIds: string[];
    eventId?: string | null;
    sportId?: string;
    sportName?: string;
    studentCount: number;
    country?: string;
    onSuccess: (result?: { paymentScreenshot?: string; studentCount?: number; paymentStatus?: string }) => void;
}

export default function RegistrationPaymentModal({
    open,
    onClose,
    studentIds,
    eventId,
    sportId,
    sportName,
    studentCount,
    country = 'malaysia',
    onSuccess,
}: RegistrationPaymentModalProps) {
    const { toast } = useToast();
    const [academyCode, setAcademyCode] = useState('');
    const [referenceId, setReferenceId] = useState('');
    const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [pricing, setPricing] = useState<{
        pricePerStudent: number;
        totalAmount: number;
        currency: string;
    }>({
        pricePerStudent: 0,
        totalAmount: 0,
        currency: 'MYR'
    });
    const [loadingPricing, setLoadingPricing] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch pricing from API - using sport-based pricing
    useEffect(() => {
        const fetchPricing = async () => {
            try {
                setLoadingPricing(true);
                
                // Use sport-based pricing if sportId is provided
                if (sportId) {
                    console.log('Fetching sport-based pricing for sportId:', sportId, 'studentCount:', studentCount);
                    const calculation = await calculatePricing('', false, studentCount, sportId);
                    
                    // Convert from cents to actual currency
                    const pricePerStudent = calculation.registrationFee / 100;
                    const totalAmount = (calculation.totalAmount / 100);
                    
                    console.log('Sport-based pricing received:', {
                        sportName: calculation.sportName,
                        pricePerStudent,
                        totalAmount,
                        currency: calculation.currency
                    });
                    
                    setPricing({
                        pricePerStudent,
                        totalAmount,
                        currency: calculation.currency.toUpperCase()
                    });
                } else {
                    // Fallback to country-based pricing if no sportId
                    console.log('Fallback to country-based pricing for country:', country);
                    const countryCode = (country || 'malaysia').toLowerCase();
                    const calculation = await calculatePricing(countryCode, false, studentCount);
                    
                    const pricePerStudent = calculation.registrationFee / 100;
                    const totalAmount = (calculation.totalAmount / 100);
                    
                    setPricing({
                        pricePerStudent,
                        totalAmount,
                        currency: calculation.currency.toUpperCase()
                    });
                }
            } catch (error) {
                console.error('Error fetching pricing:', error);
                // Fallback pricing - set to 0 MYR
                setPricing({
                    pricePerStudent: 0,
                    totalAmount: 0,
                    currency: 'MYR'
                });
            } finally {
                setLoadingPricing(false);
            }
        };

        if (open && studentCount > 0) {
            fetchPricing();
        }
    }, [sportId, country, studentCount, open]);

    const { pricePerStudent, totalAmount, currency } = pricing;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast({
                    variant: "destructive",
                    title: "File too large",
                    description: "Payment screenshot must be less than 5MB."
                });
                setPaymentScreenshot(null);
                return;
            }
            setPaymentScreenshot(file);
        } else {
            setPaymentScreenshot(null);
        }
    };

    const handleCopyAccountNumber = () => {
        navigator.clipboard.writeText(BANK_DETAILS.accountNumber);
        setCopied(true);
        toast({
            title: "Copied!",
            description: "Account number copied to clipboard"
        });
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async () => {
        if (!referenceId.trim()) {
            toast({
                variant: "destructive",
                title: "Reference ID Required",
                description: "Please enter a payment reference ID to complete registration."
            });
            return;
        }

        // Validate reference ID is exactly 12 digits
        if (!/^\d{12}$/.test(referenceId.trim())) {
            toast({
                variant: "destructive",
                title: "Invalid Reference ID",
                description: "Payment Reference ID must be exactly 12 digits."
            });
            return;
        }

        if (!paymentScreenshot) {
            toast({
                variant: "destructive",
                title: "Payment Screenshot Required",
                description: "Please upload a payment screenshot to complete registration."
            });
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('paymentScreenshot', paymentScreenshot);
            
            // Send studentIds as individual entries (FormData array format)
            studentIds.forEach((id) => {
                formData.append('studentIds', id);
            });
            
            if (eventId) formData.append('eventId', eventId);
            if (sportId) formData.append('sportId', sportId);
            if (academyCode) formData.append('academyCode', academyCode);
            if (referenceId) {
                const trimmedRefId = referenceId.trim();
                formData.append('referenceNumber', trimmedRefId);
                console.log('📋 Frontend: Sending referenceNumber to backend:', trimmedRefId);
            } else {
                console.log('⚠️ Frontend: No referenceId to send');
            }
            // Don't send paymentMethod - just upload the photo
            // formData.append('paymentMethod', 'bank_transfer');
            // formData.append('amount', totalAmount.toString());
            // formData.append('currency', currency);

            // Use the register endpoint that accepts FormData
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/registration/register`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to process registration');
            }

            // Show success message
            const studentText = data.studentCount || studentCount;
            const message = studentText > 1 
                ? `${studentText} students have been successfully registered for ${sportName || 'the sport'}.`
                : `Your registration has been successfully completed!`;

            toast({
                title: "✅ Registration Successful!",
                description: message,
                duration: 5000
            });

            // Log S3 link for debugging (not shown to user)
            if (data.paymentScreenshot) {
                console.log('Payment Screenshot S3 Link:', data.paymentScreenshot);
            }

            // Pass S3 link to success callback
            onSuccess({
                paymentScreenshot: data.paymentScreenshot,
                studentCount: data.studentCount || studentCount,
                paymentStatus: data.paymentStatus || 'paid'
            });
            onClose();
        } catch (error: any) {
            console.error('Registration submission error:', error);
            toast({
                variant: "destructive",
                title: "Submission Failed",
                description: error.message || "Failed to submit registration. Please try again."
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Banknote className="h-6 w-6" /> Registration & Payment
                    </DialogTitle>
                    <DialogDescription>
                        Complete your registration by uploading payment proof
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Pricing Section */}
                    <Card className="bg-blue-50 border-blue-200">
                        <CardHeader>
                            <CardTitle className="text-lg">Registration Pricing</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {loadingPricing ? (
                                <div className="flex items-center justify-center py-4">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span className="ml-2">Loading pricing...</span>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700">
                                            {sportName || 'Sport'} Registration
                                        </span>
                                        <span className="font-medium">
                                            {currency} {pricePerStudent > 0 ? pricePerStudent.toFixed(2) : '0.00'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700">
                                            Number of Students
                                        </span>
                                        <span className="font-medium">{studentCount}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between items-center text-lg font-bold">
                                        <span className="text-blue-900">Total Amount</span>
                                        <span className="text-blue-900">
                                            {currency} {totalAmount > 0 ? totalAmount.toFixed(2) : '0.00'}
                                        </span>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Bank Account Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Bank Account Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="font-medium">Bank Name:</Label>
                                    <span className="font-semibold">{BANK_DETAILS.bankName}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <Label className="font-medium">Account Number:</Label>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold font-mono">{BANK_DETAILS.accountNumber}</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleCopyAccountNumber}
                                            className="h-8"
                                        >
                                            {copied ? (
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <Label className="font-medium">Account Name:</Label>
                                    <span className="font-semibold text-right">{BANK_DETAILS.accountName}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Separator />

                    {/* Payment Reference ID (Required) */}
                    <div className="space-y-2">
                        <Label htmlFor="referenceId" className="flex items-center gap-1">
                            Payment Reference ID (12 digits) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="referenceId"
                            type="text"
                            placeholder="Enter 12-digit reference ID"
                            value={referenceId}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                                if (value.length <= 12) {
                                    setReferenceId(value);
                                }
                            }}
                            maxLength={12}
                            required
                            className={`font-mono text-lg tracking-wider ${
                                referenceId && referenceId.length !== 12 
                                    ? 'border-red-500 focus:ring-red-500' 
                                    : referenceId.length === 12 
                                    ? 'border-green-500 focus:ring-green-500' 
                                    : ''
                            }`}
                        />
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Enter the 12-digit reference number from your bank transfer receipt.
                            </p>
                            <p className={`text-sm font-medium ${
                                referenceId.length === 12 
                                    ? 'text-green-600' 
                                    : referenceId.length > 0 
                                    ? 'text-orange-600' 
                                    : 'text-gray-500'
                            }`}>
                                {referenceId.length}/12
                            </p>
                        </div>
                        {referenceId && referenceId.length !== 12 && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <span>⚠️</span>
                                Reference ID must be exactly 12 digits
                            </p>
                        )}
                    </div>

                    {/* Academy/School Code (Optional) */}
                    <div className="space-y-2">
                        <Label htmlFor="academyCode">Your Academy/School Code (Optional)</Label>
                        <Input
                            id="academyCode"
                            placeholder="Enter your academy or school code if applicable"
                            value={academyCode}
                            onChange={(e) => setAcademyCode(e.target.value)}
                        />
                        <p className="text-sm text-muted-foreground">
                            This code helps us identify your institution.
                        </p>
                    </div>

                    {/* Payment Screenshot Upload */}
                    <div className="space-y-2">
                        <Label htmlFor="paymentScreenshot" className="flex items-center gap-2">
                            <Upload className="h-4 w-4" /> Upload Payment Screenshot <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex items-center space-x-2">
                            <Input
                                id="paymentScreenshot"
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/png, image/jpeg, image/jpg, application/pdf"
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Choose File
                            </Button>
                            {paymentScreenshot && (
                                <span className="text-sm text-gray-700">{paymentScreenshot.name}</span>
                            )}
                            {!paymentScreenshot && (
                                <span className="text-sm text-muted-foreground">No file chosen</span>
                            )}
                        </div>
                        {paymentScreenshot && (
                            <div className="mt-2">
                                <img
                                    src={URL.createObjectURL(paymentScreenshot)}
                                    alt="Payment preview"
                                    className="max-w-full h-auto max-h-48 rounded border"
                                />
                            </div>
                        )}
                        <p className="text-sm text-muted-foreground">
                            Accepted formats: JPG, PNG, PDF (Max 5MB)
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={onClose} disabled={uploading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={uploading || !paymentScreenshot || referenceId.length !== 12}>
                        {uploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Submit Registration
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

