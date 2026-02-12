import apiClient from './api';

export interface Country {
  code: string;
  name: string;
  currency: string;
  registrationFee: number;
  certificationFee: number;
}

export interface PricingCalculation {
  country?: string;
  sportId?: string;
  sportName?: string;
  currency: string;
  studentCount: number;
  registrationFee: number;
  certificationFee?: number;
  registrationTotal?: number;
  certificationTotal?: number;
  totalAmount: number;
  includeCertification?: boolean;
  breakdown: {
    registration: {
      perStudent: number;
      total: number;
      description: string;
    };
    certification?: {
      perStudent: number;
      total: number;
      description: string;
    };
  };
}

export interface SportPricing {
  sportId: string;
  sportName: string;
  currency: string;
  registrationFee: number;
  registrationFeeDisplay: string;
}

export interface PaymentIntent {
  success: boolean;
  paymentRequired: boolean;
  clientSecret?: string;
  paymentIntentId?: string;
  calculation: PricingCalculation;
  message?: string;
}

export interface PaymentConfirmation {
  success: boolean;
  message: string;
  paymentDetails?: {
    paymentIntentId: string;
    amount: number;
    currency: string;
    status: string;
    studentCount: number;
    country: string;
    includeCertification: boolean;
    eventId?: string;
    sportId?: string;
  };
  registrationResults?: {
    successful: number;
    failed: number;
    details: Array<{
      studentId: string;
      success: boolean;
      registration?: any;
      error?: string;
    }>;
  };
}

// Hardcoded countries data as fallback
const HARDCODED_COUNTRIES: Country[] = [
  {
    code: 'malaysia',
    name: 'Malaysia',
    currency: 'MYR',
    registrationFee: 0,
    certificationFee: 100
  },
  {
    code: 'dubai',
    name: 'Dubai (UAE)',
    currency: 'AED',
    registrationFee: 55,
    certificationFee: 200
  },
  {
    code: 'india',
    name: 'India',
    currency: 'INR',
    registrationFee: 100,
    certificationFee: 200
  }
];

// Get supported countries and their pricing
export const getSupportedCountries = async (): Promise<Country[]> => {
  try {
    const response = await apiClient.get('/api/payment/countries');
    return response.data.countries;
  } catch (error) {
    console.error('Error fetching supported countries:', error);
    console.log('Falling back to hardcoded countries data');
    // Return hardcoded data as fallback
    return HARDCODED_COUNTRIES;
  }
};

// Calculate pricing for given parameters (supports both country-based and sport-based)
export const calculatePricing = async (
  country: string,
  includeCertification: boolean = false,
  studentCount: number = 1,
  sportId?: string
): Promise<PricingCalculation> => {
  try {
    const response = await apiClient.post('/api/payment/calculate', {
      country,
      includeCertification,
      studentCount,
      sportId
    });
    return response.data.calculation;
  } catch (error) {
    console.error('Error calculating pricing:', error);
    throw error;
  }
};

// Calculate pricing based on sport (new sport-based pricing)
export const calculatePricingBySport = async (
  sportId: string,
  studentCount: number = 1
): Promise<PricingCalculation> => {
  try {
    const response = await apiClient.post('/api/payment/calculate', {
      sportId,
      studentCount
    });
    return response.data.calculation;
  } catch (error) {
    console.error('Error calculating sport-based pricing:', error);
    throw error;
  }
};

// Get pricing for a specific sport
export const getSportPricing = async (sportId: string): Promise<SportPricing> => {
  try {
    const response = await apiClient.get(`/api/payment/sport/${sportId}/pricing`);
    return response.data.pricing;
  } catch (error) {
    console.error('Error fetching sport pricing:', error);
    throw error;
  }
};

// Create payment intent
export const createPaymentIntent = async (params: {
  country: string;
  includeCertification?: boolean;
  studentIds: string[];
  eventId?: string | null;
  sportId?: string;
  metadata?: Record<string, any>;
}): Promise<PaymentIntent> => {
  try {
    const response = await apiClient.post('/api/payment/create-payment-intent', params);
    return response.data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

// Get payment intent status
export const getPaymentIntentStatus = async (paymentIntentId: string) => {
  try {
    const response = await apiClient.get(`/api/payment/payment-intent/${paymentIntentId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting payment intent status:', error);
    throw error;
  }
};

// Confirm payment and complete registration
export const confirmPayment = async (paymentIntentId: string): Promise<PaymentConfirmation> => {
  try {
    const response = await apiClient.post('/api/payment/confirm-payment', {
      paymentIntentId
    });
    return response.data;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};

// Create Razorpay payment order
export const createPaymentOrder = async (orderData: {
  amount: number;
  currency: string;
  [key: string]: any;
}) => {
  try {
    const response = await apiClient.post('/api/payment/create-razorpay-order', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

// Format amount for display
export const formatAmount = (amountInCents: number, currency: string): string => {
  const amount = amountInCents / 100;
  const currencySymbols: Record<string, string> = {
    myr: 'RM',
    aed: 'AED',
    inr: '₹'
  };

  const symbol = currencySymbols[currency.toLowerCase()] || currency.toUpperCase();
  return `${symbol} ${amount.toFixed(2)}`;
};