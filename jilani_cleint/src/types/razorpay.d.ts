// client/src/types/razorpay.d.ts

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: {
    [key: string]: string;
  };
  theme?: {
    color?: string;
    backdrop_color?: string;
    hide_topbar?: boolean;
  };
  modal?: {
    backdropclose?: boolean;
    escape?: boolean;
    animation?: boolean;
    handleback?: boolean;
    confirm_close?: boolean;
    ondismiss?: () => void;
  };
  handler?: (response: RazorpayResponse) => void;
  callback_url?: string;
  redirect?: boolean;
  readonly?: {
    contact?: boolean;
    email?: boolean;
    name?: boolean;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayError {
  code: string;
  description: string;
  source: string;
  step: string;
  reason: string;
  metadata: {
    order_id: string;
    payment_id: string;
  };
}

interface RazorpayFailedResponse {
  error: RazorpayError;
}

interface RazorpayInstance {
  on(event: 'payment.success', callback: (response: RazorpayResponse) => void): void;
  on(event: 'payment.failed', callback: (response: RazorpayFailedResponse) => void): void;
  on(event: 'payment.error', callback: (error: Error) => void): void;
  on(event: string, callback: Function): void;
  open(): void;
  close(): void;
}

interface RazorpayConstructor {
  new(options: RazorpayOptions): RazorpayInstance;
}

interface Window {
  Razorpay: RazorpayConstructor;
}