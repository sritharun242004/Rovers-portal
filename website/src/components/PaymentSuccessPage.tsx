import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStripe } from '@stripe/react-stripe-js';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { confirmPayment } from '@/api/payment';

export function PaymentSuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const stripe = useStripe();
    const { toast } = useToast();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = searchParams.get('payment_intent_client_secret');

        if (!clientSecret) {
            setStatus('error');
            setMessage('No payment information found.');
            return;
        }

        // Retrieve the PaymentIntent
        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            if (!paymentIntent) {
                setStatus('error');
                setMessage('Payment information not found.');
                return;
            }

            switch (paymentIntent.status) {
                case 'succeeded':
                    // Call backend to confirm payment and create registrations
                    confirmPayment(paymentIntent.id).then((confirmation) => {
                        console.log('✅ PAYMENT CONFIRMATION SUCCESS:', confirmation);
                        setStatus('success');
                        setMessage(`Payment succeeded! ${confirmation.registrationResults?.successful || 0} student${(confirmation.registrationResults?.successful || 0) > 1 ? 's' : ''} registered successfully${confirmation.paymentDetails?.includeCertification ? ' with certification' : ''}.`);
                        toast({
                            title: 'Payment & Registration Complete!',
                            description: `${confirmation.registrationResults?.successful || 0} student${(confirmation.registrationResults?.successful || 0) > 1 ? 's' : ''} registered successfully!`,
                        });
                    }).catch((error) => {
                        console.error('❌ PAYMENT CONFIRMATION ERROR:', error);
                        setStatus('error');
                        setMessage('Payment was successful, but registration failed. Please contact support.');
                        toast({
                            variant: 'destructive',
                            title: 'Registration Failed',
                            description: 'Payment succeeded but registration failed. Please contact support.',
                        });
                    });
                    break;
                case 'processing':
                    setStatus('loading');
                    setMessage('Your payment is processing. We\'ll update you when payment is received.');
                    break;
                case 'requires_payment_method':
                    setStatus('error');
                    setMessage('Your payment was not successful, please try again.');
                    break;
                default:
                    setStatus('error');
                    setMessage('Something went wrong with your payment.');
                    break;
            }
        }).catch((error) => {
            console.error('Error retrieving payment intent:', error);
            setStatus('error');
            setMessage('Failed to verify payment status.');
        });
    }, [stripe, searchParams, toast]);

    const handleContinue = () => {
        navigate('/student-selection');
    };

    const handleRetry = () => {
        navigate('/student-selection');
    };

    return (
        <div className="container py-8">
            <Card className="max-w-md mx-auto">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        {status === 'loading' && <Loader2 className="h-12 w-12 animate-spin text-blue-500" />}
                        {status === 'success' && <CheckCircle className="h-12 w-12 text-green-500" />}
                        {status === 'error' && <XCircle className="h-12 w-12 text-red-500" />}
                    </div>
                    <CardTitle>
                        {status === 'loading' && 'Processing Payment...'}
                        {status === 'success' && 'Payment Successful!'}
                        {status === 'error' && 'Payment Failed'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-gray-600">
                        {message}
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    {status === 'success' && (
                        <Button onClick={handleContinue} className="w-full">
                            Continue to Dashboard
                        </Button>
                    )}
                    {status === 'error' && (
                        <Button onClick={handleRetry} variant="outline" className="w-full">
                            Try Again
                        </Button>
                    )}
                    {status === 'loading' && (
                        <Button disabled className="w-full">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}

export default PaymentSuccessPage; 