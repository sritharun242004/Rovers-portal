import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    PaymentElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, Users, MapPin, Award } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import {
    getSupportedCountries,
    calculatePricing,
    createPaymentIntent,
    confirmPayment,
    formatAmount,
    type Country,
    type PricingCalculation,
    type PaymentIntent
} from '@/api/payment';

// Initialize Stripe (you'll need to add your publishable key to environment variables)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface PaymentModalProps {
    open: boolean;
    onClose: () => void;
    studentIds: string[];
    eventId?: string | null;
    sportId?: string;
    sportName?: string;
    preselectedCountry?: string;
    onSuccess: (paymentDetails: any) => void;
}

interface PaymentFormProps {
    countries: Country[];
    selectedCountry: string;
    includeCertification: boolean;
    calculation: PricingCalculation | null;
    studentCount: number;
    onCertificationChange: (checked: boolean) => void;
    onPayment: (paymentData: PaymentIntent) => void;
    loading: boolean;
    studentIds: string[];
    eventId?: string | null;
    sportId?: string;
    clientSecret: string | null;
    setIsPaymentProcessing: (processing: boolean) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
    countries,
    selectedCountry,
    includeCertification,
    calculation,
    studentCount,
    onCertificationChange,
    onPayment,
    loading,
    studentIds,
    eventId,
    sportId,
    clientSecret,
    setIsPaymentProcessing
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const { toast } = useToast();
    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'payment-element'>('payment-element');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        console.log('🚀 HANDLESUBMIT START');
        console.log('DEBUG: selectedCountry =', selectedCountry);
        console.log('DEBUG: calculation =', calculation);
        console.log('DEBUG: clientSecret =', clientSecret);
        console.log('DEBUG: needsPayment =', needsPayment);
        console.log('DEBUG: stripe =', !!stripe);
        console.log('DEBUG: elements =', !!elements);

        // Country is always pre-selected from event, no validation needed

        // CRITICAL: Handle free registrations immediately without any Stripe interaction
        console.log('🔍 CHECKING FREE REGISTRATION: needsPayment =', needsPayment, 'calculation =', calculation, 'clientSecret =', clientSecret);
        if (!needsPayment) {
            console.log('✅ FREE REGISTRATION: Bypassing all Stripe operations');
            if (calculation) {
                const freeRegistrationData = {
                    success: true,
                    paymentRequired: false,
                    clientSecret: undefined,
                    calculation,
                    message: 'Registration is free for this country'
                };
                onPayment(freeRegistrationData);
                return;
            } else {
                console.error('❌ FREE REGISTRATION: No calculation available');
                toast({
                    title: 'Error',
                    description: 'Unable to process free registration. Please try again.',
                    variant: 'destructive',
                });
                return;
            }
        }

        console.log('💰 PAID REGISTRATION: Payment is required');

        // For paid registrations, validate Stripe requirements
        if (!stripe || !elements) {
            console.log('❌ Stripe not loaded yet, showing toast');
            toast({
                title: 'Payment Processing Error',
                description: 'Payment system is still loading. Please wait a moment and try again.',
                variant: 'destructive',
            });
            return;
        }

        if (needsPayment && !clientSecret) {
            console.log('❌ No client secret available for paid registration');
            toast({
                title: 'Payment Setup Error',
                description: 'Payment setup failed. Please try again.',
                variant: 'destructive',
            });
            return;
        }

        console.log('✅ PAID REGISTRATION: clientSecret is available, proceeding with payment');

        setProcessing(true);
        setIsPaymentProcessing(true); // Prevent useEffect from creating new payment intents

        try {
            // Create payment intent on backend first
            console.log('Making request to create payment intent...');
            const paymentData = await createPaymentIntent({
                country: selectedCountry,
                includeCertification,
                studentIds,
                eventId,
                sportId
            });

            console.log('DEBUG: paymentData received:', paymentData);

            if (!paymentData.success) {
                throw new Error(paymentData.message || 'Failed to create payment intent');
            }

            console.log('🎯 STRIPE CONFIRMATION: Starting Stripe payment confirmation');
            console.log('🎯 STRIPE CONFIRMATION: paymentData.clientSecret =', paymentData.clientSecret);
            console.log('🎯 STRIPE CONFIRMATION: paymentMethod =', paymentMethod);
            console.log('🎯 STRIPE CONFIRMATION: stripe object exists =', !!stripe);
            console.log('🎯 STRIPE CONFIRMATION: elements object exists =', !!elements);

            // Validate clientSecret before proceeding
            if (!paymentData.clientSecret || typeof paymentData.clientSecret !== 'string' || !paymentData.clientSecret.startsWith('pi_')) {
                console.error('❌ Invalid clientSecret:', paymentData.clientSecret);
                throw new Error('Invalid payment setup. Please try again.');
            }

            console.log('✅ STRIPE CONFIRMATION: clientSecret validation passed');

            let result;

            if (paymentMethod === 'payment-element') {
                console.log('🔵 STRIPE CONFIRMATION: Using PaymentElement - calling stripe.confirmPayment()');
                console.log('🔵 STRIPE CONFIRMATION: About to call stripe.confirmPayment with elements:', !!elements);

                // For PaymentElement, we need to submit the form first
                const submitResult = await elements.submit();
                if (submitResult.error) {
                    throw new Error(submitResult.error.message);
                }

                result = await stripe.confirmPayment({
                    elements,
                    confirmParams: {
                        return_url: window.location.origin + '/payment-success'
                    }
                });

                console.log('🔵 STRIPE CONFIRMATION: stripe.confirmPayment result:', result);
            } else {
                console.log('🟡 STRIPE CONFIRMATION: Using CardElement - calling stripe.confirmCardPayment()');

                const cardElement = elements.getElement(CardElement);
                if (!cardElement) {
                    throw new Error('Card element not found');
                }

                result = await stripe.confirmCardPayment(
                    paymentData.clientSecret,
                    {
                        payment_method: {
                            card: cardElement,
                        }
                    }
                );

                console.log('🟡 STRIPE CONFIRMATION: stripe.confirmCardPayment result:', result);
            }

            console.log('🎯 STRIPE RESULT: Full result object:', result);

            if (result.error) {
                console.error('❌ STRIPE ERROR: Full error object:', result.error);
                console.error('❌ STRIPE ERROR: Error type:', result.error.type);
                console.error('❌ STRIPE ERROR: Error code:', result.error.code);
                console.error('❌ STRIPE ERROR: Error message:', result.error.message);

                // Log payment intent details if available
                if (result.error.payment_intent) {
                    console.error('❌ STRIPE ERROR: Payment Intent ID:', result.error.payment_intent.id);
                    console.error('❌ STRIPE ERROR: Payment Intent Status:', result.error.payment_intent.status);
                    console.error('❌ STRIPE ERROR: Payment Intent Object:', result.error.payment_intent);
                }

                throw new Error(result.error.message);
            }

            if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
                console.log('✅ PAYMENT SUCCESS: Payment completed, confirming with backend and creating registrations...');

                // Confirm payment on backend and create registrations
                const confirmation = await confirmPayment(result.paymentIntent.id);

                console.log('✅ REGISTRATION SUCCESS: Backend confirmation received:', confirmation);

                const paymentResult = {
                    ...paymentData,
                    confirmation,
                    stripePaymentIntent: result.paymentIntent
                };

                // Show success message with registration details
                toast({
                    title: 'Payment & Registration Complete!',
                    description: `${confirmation.registrationResults?.successful || 0} student${(confirmation.registrationResults?.successful || 0) > 1 ? 's' : ''} registered successfully${confirmation.paymentDetails?.includeCertification ? ' with certification' : ''}`,
                });

                onPayment(paymentResult);
            }

        } catch (error: any) {
            console.error('Payment error:', error);
            toast({
                title: 'Payment Failed',
                description: error.message || 'An error occurred during payment processing.',
                variant: 'destructive',
            });
        } finally {
            setProcessing(false);
            setIsPaymentProcessing(false); // Reset payment processing state
        }
    };

    const needsPayment = calculation && calculation.totalAmount > 0;

    // Debug: Log button state to identify why it's disabled
    const isStripeReady = !needsPayment || (stripe && elements);
    const buttonDisabled = Boolean(processing || loading || (needsPayment && !isStripeReady));

    console.log('🔘 PAYMENT BUTTON DEBUG:', {
        processing,
        loading,
        selectedCountry,
        needsPayment,
        calculation,
        stripe: !!stripe,
        elements: !!elements,
        isStripeReady,
        buttonDisabled
    });

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Country Information (Read-only) */}
            <div className="space-y-2">
                <Label>Event Country</Label>
                <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">
                            {countries.find(c => c.code === selectedCountry)?.name || 'Unknown Country'}
                        </span>
                    </div>
                    <Badge variant="outline">
                        {countries.find(c => c.code === selectedCountry)?.currency || 'N/A'}
                    </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                    Pricing is based on the event's country and cannot be changed.
                </p>
            </div>

            {/* Certification Checkbox */}
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="certification"
                    checked={includeCertification}
                    onCheckedChange={onCertificationChange}
                />
                <Label htmlFor="certification" className="flex items-center space-x-2">
                    <Award className="h-4 w-4" />
                    <span>Include certification</span>
                </Label>
            </div>

            {/* Pricing Breakdown */}
            {calculation && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Registration Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{calculation.country}</span>
                            <Badge variant="outline">{calculation.currency.toUpperCase()}</Badge>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Registration Fee ({studentCount} student{studentCount > 1 ? 's' : ''})</span>
                                <span>{formatAmount(calculation.registrationFee * studentCount, calculation.currency)}</span>
                            </div>
                            {includeCertification && (
                                <div className="flex justify-between">
                                    <span className="flex items-center gap-1">
                                        <Award className="h-3 w-3" />
                                        Certification Fee
                                    </span>
                                    <span>{formatAmount(calculation.certificationFee * studentCount, calculation.currency)}</span>
                                </div>
                            )}
                            <Separator />
                            <div className="flex justify-between font-semibold text-lg">
                                <span>Total</span>
                                <span>{formatAmount(calculation.totalAmount, calculation.currency)}</span>
                            </div>
                        </div>

                        {calculation.totalAmount === 0 && (
                            <Alert>
                                <AlertDescription>
                                    🎉 Registration is free for {calculation.country}!
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Payment Methods */}
            {needsPayment && clientSecret && typeof clientSecret === 'string' && clientSecret.startsWith('pi_') && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Payment Method
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Payment Method Selection */}
                        <div className="flex gap-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="payment-element"
                                    checked={paymentMethod === 'payment-element'}
                                    onChange={() => setPaymentMethod('payment-element')}
                                />
                                <span>All Payment Methods</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="card"
                                    checked={paymentMethod === 'card'}
                                    onChange={() => setPaymentMethod('card')}
                                />
                                <span>Card Only</span>
                            </label>
                        </div>

                        {/* Payment Elements */}
                        {paymentMethod === 'payment-element' ? (
                            <PaymentElement />
                        ) : (
                            <div className="p-3 border rounded-md">
                                <CardElement
                                    options={{
                                        style: {
                                            base: {
                                                fontSize: '16px',
                                                color: '#424770',
                                                '::placeholder': {
                                                    color: '#aab7c4',
                                                },
                                            },
                                        },
                                    }}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Payment required but no valid clientSecret */}
            {needsPayment && (!clientSecret || !clientSecret.startsWith('pi_')) && (
                <Alert>
                    <AlertDescription>
                        Payment setup is required but not available. Please try again or contact support.
                    </AlertDescription>
                </Alert>
            )}

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={buttonDisabled}
                className="w-full"
                size="lg"
            >
                {processing ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {needsPayment ? 'Processing Payment...' : 'Processing Registration...'}
                    </>
                ) : (
                    <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        {needsPayment
                            ? `Pay ${calculation ? formatAmount(calculation.totalAmount, calculation.currency) : ''}`
                            : 'Complete Free Registration'
                        }
                    </>
                )}
            </Button>
        </form>
    );
};

const PaymentModal: React.FC<PaymentModalProps> = ({
    open,
    onClose,
    studentIds,
    eventId,
    sportId,
    sportName,
    preselectedCountry,
    onSuccess
}) => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [selectedCountry, setSelectedCountry] = useState(preselectedCountry || 'malaysia');
    const [includeCertification, setIncludeCertification] = useState(true);
    const [calculation, setCalculation] = useState<PricingCalculation | null>(null);
    const [loading, setLoading] = useState(true);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    const { toast } = useToast();

    const studentCount = studentIds.length;

    // Debug logging
    useEffect(() => {
        if (open) {
            console.log('🔍 PaymentModal opened with props:', {
                studentIds,
                eventId,
                sportId,
                sportName,
                studentCount
            });
        }
    }, [open, studentIds, eventId, sportId, sportName, studentCount]);

    // Load countries on mount
    useEffect(() => {
        const loadCountries = async () => {
            try {
                const countriesData = await getSupportedCountries();
                setCountries(countriesData);
            } catch (error) {
                console.error('Error loading countries:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load countries. Please refresh and try again.',
                    variant: 'destructive',
                });
            } finally {
                setLoading(false);
            }
        };

        if (open) {
            loadCountries();
        }
    }, [open, toast]);

    // Recalculate pricing when country or certification changes
    useEffect(() => {
        const updatePricing = async () => {
            // Early exit if payment is being processed
            if (isPaymentProcessing) {
                console.log('⚡ USEEFFECT: Payment is being processed, skipping pricing update');
                return;
            }

            if (studentCount === 0) {
                setCalculation(null);
                setClientSecret(null);
                return;
            }

            // Check if country is selected
            if (!selectedCountry || selectedCountry.trim() === '') {
                console.log('⚡ USEEFFECT: No country selected, skipping pricing update');
                setCalculation(null);
                setClientSecret(null);
                return;
            }

            try {
                console.log('⚡ USEEFFECT: Pricing update triggered');
                console.log('⚡ USEEFFECT: selectedCountry =', selectedCountry);
                console.log('⚡ USEEFFECT: includeCertification =', includeCertification);
                console.log('⚡ USEEFFECT: studentCount =', studentCount);
                console.log('⚡ USEEFFECT: Calling calculatePricing...');

                const pricing = await calculatePricing(
                    selectedCountry,
                    includeCertification,
                    studentCount
                );

                console.log('⚡ USEEFFECT: Pricing calculated:', pricing);
                setCalculation(pricing);

                if (pricing.totalAmount > 0) {
                    console.log('⚡ USEEFFECT: Payment required, creating payment intent...');

                    // Validate required fields before creating payment intent
                    if (!sportId) {
                        console.error('❌ USEEFFECT: Cannot create payment intent - sportId is missing');
                        toast({
                            title: 'Registration Error',
                            description: 'Sport information is missing. Please go back and select a sport.',
                            variant: 'destructive',
                        });
                        setClientSecret(null);
                        return;
                    }

                    if (studentIds.length === 0) {
                        console.error('❌ USEEFFECT: Cannot create payment intent - no students selected');
                        toast({
                            title: 'Registration Error',
                            description: 'No students selected. Please select at least one student.',
                            variant: 'destructive',
                        });
                        setClientSecret(null);
                        return;
                    }

                    try {
                        console.log('⚡ USEEFFECT: Creating payment intent with:', {
                            country: selectedCountry,
                            includeCertification,
                            studentIds,
                            eventId,
                            sportId
                        });

                        const paymentData = await createPaymentIntent({
                            country: selectedCountry,
                            includeCertification,
                            studentIds,
                            eventId,
                            sportId
                        });

                        console.log('⚡ USEEFFECT: createPaymentIntent result:', paymentData);

                        // Only set clientSecret if payment setup was successful
                        if (paymentData.success && paymentData.clientSecret) {
                            console.log('✅ USEEFFECT: Payment intent successful, setting clientSecret:', paymentData.clientSecret);
                            setClientSecret(paymentData.clientSecret);
                        } else {
                            console.warn('❌ USEEFFECT: Payment intent creation failed:', paymentData.message);
                            setClientSecret(null);
                            // Show error to user
                            toast({
                                title: 'Payment Setup Error',
                                description: paymentData.message || 'Payment processing is not available.',
                                variant: 'destructive',
                            });
                        }
                    } catch (error) {
                        console.error('Error creating payment intent in useEffect:', error);
                        setClientSecret(null);
                        toast({
                            title: 'Payment Setup Error',
                            description: 'Failed to setup payment processing.',
                            variant: 'destructive',
                        });
                    }
                } else {
                    console.log('⚡ USEEFFECT: No payment required (free registration), clearing clientSecret');
                    setClientSecret(null);
                }
            } catch (error) {
                console.error('Error calculating pricing:', error);
                toast({
                    title: 'Pricing Error',
                    description: 'Failed to calculate pricing. Please try again.',
                    variant: 'destructive',
                });
                setClientSecret(null);
            }
        };

        updatePricing();
    }, [selectedCountry, includeCertification, studentCount, studentIds, eventId, sportId, toast, isPaymentProcessing]);

    const handlePaymentSuccess = (paymentData: PaymentIntent) => {
        toast({
            title: 'Payment Successful!',
            description: `Successfully registered ${studentCount} student${studentCount > 1 ? 's' : ''} for ${sportName || 'the sport'}.`,
        });
        onSuccess(paymentData);
        onClose();
    };

    const handleClose = () => {
        setSelectedCountry(preselectedCountry || '');
        setIncludeCertification(true);
        setCalculation(null);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Complete Registration Payment</DialogTitle>
                    <DialogDescription>
                        Complete the payment process to register {studentCount} student{studentCount > 1 ? 's' : ''}
                        {sportName && ` for ${sportName}`}.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        <span>Loading payment options...</span>
                    </div>
                ) : (
                    <>
                        {console.log('🔧 ELEMENTS CONFIG: clientSecret =', clientSecret)}
                        {console.log('🔧 ELEMENTS CONFIG: calculation =', calculation)}
                        {console.log('🔧 ELEMENTS CONFIG: Elements options will be:', {
                            ...(clientSecret &&
                                typeof clientSecret === 'string' &&
                                clientSecret.startsWith('pi_') &&
                                calculation &&
                                calculation.totalAmount > 0
                                ? { clientSecret }
                                : { mode: 'setup', currency: 'usd' }
                            )
                        })}
                        <Elements
                            key={clientSecret} // Force remount when clientSecret changes
                            stripe={stripePromise}
                            options={{
                                ...(clientSecret &&
                                    typeof clientSecret === 'string' &&
                                    clientSecret.startsWith('pi_') &&
                                    calculation &&
                                    calculation.totalAmount > 0
                                    ? { clientSecret }
                                    : { mode: 'setup', currency: 'usd' }
                                ),
                                appearance: {
                                    theme: 'stripe',
                                    variables: {
                                        colorPrimary: '#0570de',
                                        colorBackground: '#ffffff',
                                        colorText: '#30313d',
                                        colorDanger: '#df1b41',
                                        fontFamily: 'system-ui, sans-serif',
                                        spacingUnit: '4px',
                                        borderRadius: '8px'
                                    }
                                }
                            }}
                        >
                            <PaymentForm
                                countries={countries}
                                selectedCountry={selectedCountry}
                                includeCertification={includeCertification}
                                calculation={calculation}
                                studentCount={studentCount}
                                onCertificationChange={setIncludeCertification}
                                onPayment={handlePaymentSuccess}
                                loading={loading}
                                studentIds={studentIds}
                                eventId={eventId}
                                sportId={sportId}
                                clientSecret={clientSecret}
                                setIsPaymentProcessing={setIsPaymentProcessing}
                            />
                        </Elements>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default PaymentModal; 