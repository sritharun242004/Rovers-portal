import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from '@/hooks/useToast';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { loadRazorpayScript, debugRazorpayDom } from '@/utils/razorpayLoader';

interface RazorpayCheckoutProps {
  orderId: string;
  amount: number;
  currency: string;
  onSuccess: (response: any) => void;
  onFailure: (error: any) => void;
  onCancel: () => void;
  openRazorpay?: () => void;
}

export function RazorpayCheckout({
  orderId,
  amount,
  currency,
  onSuccess,
  onFailure,
  onCancel,
  openRazorpay
}: RazorpayCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const { toast } = useToast();

  // Function to remove overlays that might interfere with Razorpay
  const removeOverlays = () => {
    // Find and remove or modify overlay elements
    const overlays = document.querySelectorAll('[data-radix-popper-content-wrapper], [role="dialog"] + div, .fixed.inset-0.bg-black');

    overlays.forEach(overlay => {
      // Instead of removing, set pointer-events to none and reduce opacity
      if (overlay instanceof HTMLElement) {
        overlay.style.pointerEvents = 'none';
        overlay.style.opacity = '0';
      }
    });

    // Add a style tag to ensure Razorpay elements are above everything else
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      .razorpay-container, .razorpay-checkout-frame, iframe[name="razorpay-checkout-frame"] {
        z-index: 2147483647 !important; /* Highest possible z-index */
        pointer-events: auto !important;
      }
      .razorpay-backdrop {
        opacity: 0.2 !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(styleTag);
  };

  // Load Razorpay script on component mount
  useEffect(() => {
    const loadRazorpay = async () => {
      try {
        const loaded = await loadRazorpayScript();
        setRazorpayLoaded(loaded);
        if (!loaded) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load payment gateway. Please try again."
          });
        }
      } catch (error) {
        console.error("Error loading Razorpay:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load payment gateway. Please try again."
        });
      }
    };

    loadRazorpay();
  }, [toast]);

  // Handle overlay removal and Razorpay opening
  useEffect(() => {
    // Try opening Razorpay after a short delay to ensure our overlay handling runs
    setTimeout(() => {
      removeOverlays();

      // Now open Razorpay
      if (typeof openRazorpay === 'function') {
        openRazorpay();
      }
    }, 300);

    // Clean up function
    return () => {
      // Find the style tag we added and remove it
      const styleTags = document.querySelectorAll('style');
      styleTags.forEach(tag => {
        if (tag.innerHTML.includes('razorpay-container')) {
          tag.remove();
        }
      });

      // Restore overlay visibility
      const overlays = document.querySelectorAll('[data-radix-popper-content-wrapper], [role="dialog"] + div, .fixed.inset-0.bg-black');
      overlays.forEach(overlay => {
        if (overlay instanceof HTMLElement) {
          overlay.style.pointerEvents = '';
          overlay.style.opacity = '';
        }
      });
    };
  }, [openRazorpay]);

  // Function to handle the payment process
  const handlePaymentClick = () => {
    if (!razorpayLoaded || !window.Razorpay) {
      console.error('Razorpay not loaded properly');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Payment gateway not loaded. Please refresh the page."
      });
      return;
    }

    try {
      setIsLoading(true);
      removeOverlays();

      // Log key being used

      const options: RazorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: "Rovers",
        description: "Sport Registration",
        order_id: orderId,
        handler: function(response) {
          setIsLoading(false);
          onSuccess(response);
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
            onCancel();
          },
          escape: true,
          backdropclose: false
        },
        theme: {
          color: "#2961b6"
        }
      };
      // Add custom styling to ensure the modal is accessible
      const styleTag = document.createElement('style');
      styleTag.id = 'razorpay-style-fix';
      styleTag.innerHTML = `
        .razorpay-backdrop { opacity: 0.2 !important; pointer-events: none !important; }
        iframe[name="razorpay-checkout-frame"] {
          opacity: 1 !important;
          pointer-events: auto !important;
          z-index: 2147483647 !important;
        }
        * { pointer-events: auto !important; }
      `;
      document.head.appendChild(styleTag);
      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function(response) {
        setIsLoading(false);
        onFailure(response.error);
      });

      // Open Razorpay
      rzp.open();
      debugRazorpayDom();
    } catch (error) {
      setIsLoading(false);
      onFailure(error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold">Complete your payment</h3>
          <p>Click the button below to open the payment gateway.</p>
          <p className="font-semibold text-lg">Amount: {currency} {amount/100}</p>
          
          {/* Processing payment indicators */}
          {isLoading && (
            <div className="mt-4">
              <div className="flex justify-center mb-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Please wait while we redirect you to our secure payment gateway...
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Order ID: {orderId}
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 pb-6">
        <Button
          onClick={handlePaymentClick}
          disabled={isLoading || !razorpayLoaded}
          className="w-full"
        >
          {isLoading ? "Processing..." : "Pay Now"}
        </Button>
        
        {isLoading && (
          <>
            <p className="text-xs text-center text-muted-foreground">
              If the payment window doesn't open automatically, please click below
            </p>
            <Button
              variant="outline"
              onClick={() => {
                removeOverlays();
                if (typeof openRazorpay === 'function') {
                  openRazorpay();
                } else {
                  handlePaymentClick();
                }
              }}
              className="w-full"
            >
              Open Payment Window
            </Button>
            <Button
              variant="ghost"
              onClick={onCancel}
              className="w-full mt-2"
              size="sm"
            >
              Cancel Payment
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}

export default RazorpayCheckout;