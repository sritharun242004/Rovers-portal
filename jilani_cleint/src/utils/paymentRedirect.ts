import { createPaymentOrder } from '@/api/payment';

/**
 * Redirects the user to a Razorpay payment page in a new tab
 */
export async function redirectToPayment(registrationData, amount = 100, currency = 'RS') {
  try {
    console.log('=== REDIRECT TO PAYMENT ===');
    console.log('Registration data:', registrationData);
    console.log('Amount:', amount, 'Currency:', currency);

    // Create the order
    const orderResponse = await createPaymentOrder({
      amount,
      currency,
      ...registrationData
    });

    if (!orderResponse.success || !orderResponse.order) {
      console.error('Failed to create payment order:', orderResponse);
      throw new Error('Failed to create payment order');
    }

    console.log('Order created successfully:', orderResponse.order.id);

    // Store registration data in localStorage for retrieval after payment
    localStorage.setItem('pendingRegistration', JSON.stringify(registrationData));

    const clientOrigin = window.location.origin;
    const redirectUrl = `${clientOrigin}/payment-redirect`;

    // Here's the key - let's log exactly what URL we're using
    const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    console.log('Using Razorpay Key ID:', razorpayKeyId);

    // Construct the payment URL
    const paymentUrl = `https://api.razorpay.com/v1/checkout/embedded?key=${razorpayKeyId}&order_id=${orderResponse.order.id}&name=Rovers&description=Sport Registration&prefill[name]=Student Registration&image=&callback_url=${encodeURIComponent(redirectUrl)}&cancel_url=${encodeURIComponent(redirectUrl + '?error=' + encodeURIComponent('Payment was cancelled'))}`;

    console.log('Payment URL constructed:', paymentUrl);

    // Open the payment URL in a new tab
    console.log('Attempting to open payment URL in new tab');
    const newWindow = window.open(paymentUrl, '_blank');

    if (!newWindow) {
      console.error('Failed to open new window. Popup might be blocked.');
      return false;
    }

    console.log('New window opened successfully');
    return true;
  } catch (error) {
    console.error('Error redirecting to payment:', error);
    throw error;
  }
}