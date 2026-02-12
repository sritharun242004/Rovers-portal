import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/useToast';
import { createPaymentOrder, verifyPaymentAndRegister } from '@/api/payment';

interface RazorpayPaymentProps {
  amount: number;
  registrationData: {
    studentId: string;
    sportId: string;
    eventId?: string;
    ageCategoryId?: string;
    distanceId?: string;
    sportSubTypeId?: string;
  };
  onSuccess: (registration: any) => void;
  onCancel: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function RazorpayPayment({ amount, registrationData, onSuccess, onCancel }: RazorpayPaymentProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('Razorpay script loaded successfully');
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
    };
    document.body.appendChild(script);

    return () => {
      // Clean up script when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      if (!amount || !registrationData.studentId || !registrationData.sportId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Amount, student, and sport are required"
        });
        setIsLoading(false);
        return;
      }

      // Create order
      const orderResponse = await createPaymentOrder({
        amount,
        currency: 'RS',
        ...registrationData,
      });

      if (!orderResponse.success || !orderResponse.order) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create payment order"
        });
        setIsLoading(false);
        return;
      }
      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderResponse.order.amount,
        currency: orderResponse.order.currency,
        name: 'Rovers',
        description: 'Sport Registration',
        order_id: orderResponse.order.id,
        handler: async function (response) {
          try {
            console.log('Payment successful, verifying...', response);
            // Verify payment and complete registration
            const verifyResponse = await verifyPaymentAndRegister({
              orderId: orderResponse.order.id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              registrationData
            });

            if (verifyResponse.success) {
              toast({
                title: "Success",
                description: "Payment successful and registration completed!"
              });
              onSuccess(verifyResponse.registration);
            } else {
              toast({
                variant: "destructive",
                title: "Error",
                description: verifyResponse.message || "Payment verification failed"
              });
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast({
              variant: "destructive",
              title: "Error",
              description: error.message || "Payment verification failed"
            });
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: 'Student Registration',
          email: '',
          contact: ''
        },
        notes: {
          studentId: registrationData.studentId,
          sportId: registrationData.sportId
        },
        theme: {
          color: '#2961b6'
        },
        modal: {
          ondismiss: function () {
            console.log('Razorpay modal dismissed');
            toast({
              title: "Info",
              description: "Payment cancelled"
            });
            setIsLoading(false);
            onCancel();
          },
          confirm_close: true,
          escape: true,
          animation: true,
          handleback: true,
          backdropclose: false
        },
        readonly: {
          contact: false,
          email: false,
          name: false
        }
      };

      // Only create Razorpay instance if window.Razorpay exists
      if (!window.Razorpay) {
        console.error('Razorpay not loaded');
        toast({
          variant: "destructive",
          title: "Error",
          description: "Payment gateway not loaded. Please refresh the page."
        });
        setIsLoading(false);
        return;
      }
      const razorpay = new window.Razorpay(options);

      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed response:', response);
        toast({
          variant: "destructive",
          title: "Payment Failed",
          description: response.error.description || "Payment failed"
        });
        setIsLoading(false);
      });

      razorpay.on('payment.error', function (error) {
        console.error('Razorpay error event:', error);
        toast({
          variant: "destructive",
          title: "Payment Error",
          description: "An error occurred during payment processing"
        });
        setIsLoading(false);
      });

      razorpay.open();
   
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to process payment"
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center p-6">
      <h3 className="text-xl font-bold">Complete Payment</h3>
      <p className="text-center mb-4">
        To complete your registration, please proceed with the payment of RS {amount.toFixed(2)}.
      </p>
      <Button onClick={handlePayment} disabled={isLoading} className="w-full">
        {isLoading ? "Processing..." : `Pay Now RS ${amount.toFixed(2)}`}
      </Button>
      <Button variant="outline" onClick={onCancel} className="w-full">
        Cancel
      </Button>
    </div>
  );
}