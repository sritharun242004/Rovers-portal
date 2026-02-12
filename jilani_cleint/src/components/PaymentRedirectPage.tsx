import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';

export function PaymentRedirectPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // This component is no longer used with Stripe payments
    // Redirect to student selection page after a short delay
    const timer = setTimeout(() => {
      navigate('/student-selection');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleBackToRegistrations = () => {
    navigate('/student-selection');
  };

  return (
    <div className="container py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Redirecting...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">
            We've updated our payment system. Redirecting you to the new student registration page...
          </p>
          <div className="flex justify-center">
            <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleBackToRegistrations}>
            Go to Student Registration
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default PaymentRedirectPage;