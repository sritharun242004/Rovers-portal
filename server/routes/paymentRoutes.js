const express = require('express');
const router = express.Router();
const PaymentService = require('../services/paymentService');
const RegistrationService = require('../services/registrationService');
const requireUser = require('../middleware/requireUser');

// Get supported countries and pricing (public endpoint - no auth required)
router.get('/countries', async (req, res, next) => {
  try {
    const countries = PaymentService.getSupportedCountries();

    res.json({
      success: true,
      countries
    });
  } catch (error) {
    console.error('Error fetching supported countries:', error);
    next(error);
  }
});

// Calculate pricing for given parameters (supports both country-based and sport-based)
router.post('/calculate', async (req, res, next) => {
  try {
    const { country, includeCertification = false, studentCount = 1, sportId } = req.body;

    // Validate student count
    if (studentCount < 1 || studentCount > 50) {
      return res.status(400).json({
        success: false,
        message: 'Student count must be between 1 and 50'
      });
    }

    let calculation;

    // If sportId is provided, use sport-based pricing (new system)
    if (sportId) {
      console.log(`Calculating sport-based pricing for sportId: ${sportId}, studentCount: ${studentCount}`);
      calculation = await PaymentService.calculateAmountBySport(sportId, studentCount);
    } 
    // Otherwise, use country-based pricing (legacy system)
    else if (country) {
      console.log(`Calculating country-based pricing for country: ${country}, studentCount: ${studentCount}`);
      calculation = PaymentService.calculateAmount(country, includeCertification, studentCount);
    } 
    // No valid pricing parameter provided
    else {
      return res.status(400).json({
        success: false,
        message: 'Either sportId or country is required for pricing calculation'
      });
    }

    res.json({
      success: true,
      calculation
    });
  } catch (error) {
    console.error('Error calculating pricing:', error);

    if (error.message.includes('Pricing not configured') || error.message.includes('Sport not found')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
});

// Get pricing for a specific sport
router.get('/sport/:sportId/pricing', async (req, res, next) => {
  try {
    const { sportId } = req.params;

    if (!sportId) {
      return res.status(400).json({
        success: false,
        message: 'Sport ID is required'
      });
    }

    const pricing = await PaymentService.getSportPricing(sportId);

    res.json({
      success: true,
      pricing
    });
  } catch (error) {
    console.error('Error fetching sport pricing:', error);

    if (error.message.includes('Sport not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
});

// Create payment intent
router.post('/create-payment-intent', requireUser, async (req, res, next) => {
  try {
    const {
      country,
      includeCertification = false,
      studentIds = [],
      eventId = null,
      sportId,
      metadata = {}
    } = req.body;

    // Validation
    if (!country) {
      return res.status(400).json({
        success: false,
        message: 'Country is required'
      });
    }

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one student must be selected'
      });
    }

    if (studentIds.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Cannot register more than 50 students at once'
      });
    }

    const studentCount = studentIds.length;
    const { _id: userId, email: userEmail } = req.user;

    console.log('🚀 Creating payment intent with params:', {
      country,
      includeCertification,
      studentCount,
      studentIds,
      eventId,
      sportId,
      userId: userId.toString(),
      userEmail
    });

    // Create payment intent
    const paymentResult = await PaymentService.createPaymentIntent({
      country,
      includeCertification,
      studentCount,
      studentIds: Array.isArray(studentIds) ? studentIds.slice(0, 50) : [],
      eventId,
      sportId,
      userId: userId.toString(),
      userEmail,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString()
      }
    });

    res.json(paymentResult);
  } catch (error) {
    console.error('Error creating payment intent:', error);

    if (error.message && error.message.includes('Pricing not configured')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    // Surface error to client instead of generic 500 middleware
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create payment intent'
    });
  }
});

// Get payment intent status
router.get('/payment-intent/:paymentIntentId', requireUser, async (req, res, next) => {
  try {
    const { paymentIntentId } = req.params;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID is required'
      });
    }

    const paymentIntent = await PaymentService.getPaymentIntent(paymentIntentId);

    res.json({
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata,
        description: paymentIntent.description,
        receipt_email: paymentIntent.receipt_email
      }
    });
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    next(error);
  }
});

// Confirm payment success and process registration
router.post('/confirm-payment', requireUser, async (req, res, next) => {
  try {
    console.log('🔍 Payment confirmation request received:', {
      body: req.body,
      user: req.user?._id,
      timestamp: new Date().toISOString()
    });

    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      console.error('❌ Missing paymentIntentId in request body');
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID is required'
      });
    }

    // Get payment intent details
    console.log(`🔍 Fetching payment intent: ${paymentIntentId}`);
    const paymentIntent = await PaymentService.getPaymentIntent(paymentIntentId);
    console.log(`🔍 Payment intent status: ${paymentIntent.status}`);

    if (paymentIntent.status !== 'succeeded') {
      console.error(`❌ Payment intent status is not succeeded: ${paymentIntent.status}`);
      return res.status(400).json({
        success: false,
        message: 'Payment has not been completed successfully',
        status: paymentIntent.status
      });
    }

    // Extract metadata
    const metadata = paymentIntent.metadata;

    // Handle different metadata formats for student IDs
    let studentIds = [];

    if (metadata.studentIds) {
      // Legacy format: JSON array
      studentIds = JSON.parse(metadata.studentIds || '[]');
    } else if (metadata.studentIdsCsv) {
      // Simple CSV format (single field)
      studentIds = metadata.studentIdsCsv.split(',').filter(id => id.trim() !== '');
    } else if (metadata.studentIdsChunks) {
      // Chunked format for large arrays
      const chunkCount = parseInt(metadata.studentIdsChunks);
      let combinedCsv = '';

      for (let i = 0; i < chunkCount; i++) {
        const chunkKey = `studentIds_${i}`;
        if (metadata[chunkKey]) {
          if (combinedCsv && !combinedCsv.endsWith(',')) {
            combinedCsv += ',';
          }
          combinedCsv += metadata[chunkKey];
        }
      }

      studentIds = combinedCsv.split(',').filter(id => id.trim() !== '');
    }

    const { country, includeCertification, eventId, sportId } = metadata;

    console.log('🔍 Payment intent metadata:', metadata);
    console.log('🔍 Extracted student IDs:', {
      studentIds,
      studentIdsLength: studentIds.length,
      format: metadata.studentIds ? 'legacy-json' :
        metadata.studentIdsCsv ? 'simple-csv' :
          metadata.studentIdsChunks ? 'chunked-csv' : 'unknown',
      rawStudentIds: metadata.studentIds,
      rawStudentIdsCsv: metadata.studentIdsCsv,
      chunks: metadata.studentIdsChunks
    });
    console.log('Processing registrations for payment:', {
      paymentIntentId: paymentIntent.id,
      studentIds,
      sportId,
      eventId,
      country,
      includeCertification: includeCertification === 'true'
    });

    // Validate required fields
    if (!sportId || sportId === '') {
      return res.status(400).json({
        success: false,
        message: 'Sport ID is missing from payment metadata. Please try registering again.',
        paymentDetails: {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status
        }
      });
    }

    if (studentIds.length === 0) {
      console.error('❌ No student IDs found in payment metadata:', {
        paymentIntentId: paymentIntent.id,
        metadata,
        hasStudentIds: !!metadata.studentIds,
        hasStudentIdsCsv: !!metadata.studentIdsCsv,
        studentIdsRaw: metadata.studentIds,
        studentIdsCsvRaw: metadata.studentIdsCsv
      });

      return res.status(400).json({
        success: false,
        message: 'No students found in payment metadata. This may be due to a payment processing issue. Please try registering again, and if the problem persists, contact support.',
        paymentDetails: {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status
        },
        debugInfo: {
          metadataKeys: Object.keys(metadata),
          hasStudentIds: !!metadata.studentIds,
          hasStudentIdsCsv: !!metadata.studentIdsCsv
        }
      });
    }

    // Use bulk registration for better performance
    let registrationResults = [];
    let successfulRegistrations = [];
    let failedRegistrations = [];

    try {
      const startTime = Date.now();
      console.log('🚀 Starting bulk registration for payment confirmation...', {
        studentCount: studentIds.length,
        paymentIntentId: paymentIntent.id
      });

      const bulkRegistrationData = {
        studentIds,
        sportId,
        eventId: eventId || null,
        paymentIntentId: paymentIntent.id,
        paymentStatus: paymentIntent.amount > 0 ? 'paid' : 'free',
        paymentMethod: 'stripe',
        paymentAmount: paymentIntent.amount,
        paymentCurrency: paymentIntent.currency,
        country,
        includeCertification: includeCertification === 'true',
        registrationType: 'online_payment'
      };

      const bulkResult = await RegistrationService.bulkRegisterStudentsForPayment(
        req.user._id,
        bulkRegistrationData
      );

      // Convert bulk result to individual results format for compatibility
      registrationResults = studentIds.map(studentId => ({
        studentId,
        success: true,
        registration: bulkResult
      }));

      successfulRegistrations = registrationResults;
      failedRegistrations = [];

      const endTime = Date.now();
      const duration = endTime - startTime;
      console.log(`✅ Bulk registration completed successfully: ${bulkResult.successCount} students registered in ${duration}ms (${(duration / studentIds.length).toFixed(1)}ms per student)`);

    } catch (error) {
      console.error('❌ Bulk registration failed, falling back to individual registration:', error);

      const fallbackStartTime = Date.now();
      console.log('🔄 Starting individual registration fallback...');

      // Fallback to individual registration if bulk fails
      for (const studentId of studentIds) {
        try {
          const registrationData = {
            studentId,
            studentIds: [studentId],
            sportId,
            eventId: eventId || null,
            paymentIntentId: paymentIntent.id,
            paymentStatus: paymentIntent.amount > 0 ? 'paid' : 'free',
            paymentMethod: 'stripe',
            paymentAmount: paymentIntent.amount,
            paymentCurrency: paymentIntent.currency,
            country,
            includeCertification: includeCertification === 'true',
            registrationType: 'online_payment',
            transactionId: paymentIntent.id
          };

          console.log(`🔄 Attempting individual registration for student ${studentId}`);

          const result = await RegistrationService.registerStudentForSport(
            req.user._id,
            registrationData
          );

          registrationResults.push({
            studentId,
            success: true,
            registration: result
          });

          console.log(`✅ Individual registration successful for student ${studentId}`);
        } catch (individualError) {
          console.error(`❌ Individual registration failed for student ${studentId}:`, individualError);
          registrationResults.push({
            studentId,
            success: false,
            error: individualError.message
          });
        }
      }

      // Recalculate success/failure counts after individual processing
      successfulRegistrations = registrationResults.filter(r => r.success);
      failedRegistrations = registrationResults.filter(r => !r.success);

      const fallbackEndTime = Date.now();
      const fallbackDuration = fallbackEndTime - fallbackStartTime;
      console.log(`⚠️ Individual registration fallback completed: ${successfulRegistrations.length} successful, ${failedRegistrations.length} failed in ${fallbackDuration}ms (${(fallbackDuration / studentIds.length).toFixed(1)}ms per student)`);
    }

    // Check if all registrations were successful (variables already declared above)
    if (!successfulRegistrations.length && !failedRegistrations.length) {
      // This handles the case where variables weren't set in the bulk registration block
      successfulRegistrations = registrationResults.filter(r => r.success);
      failedRegistrations = registrationResults.filter(r => !r.success);
    }

    if (failedRegistrations.length > 0) {
      console.warn('Some registrations failed:', failedRegistrations);
    }

    res.json({
      success: true,
      message: `Payment confirmed and ${successfulRegistrations.length} student${successfulRegistrations.length > 1 ? 's' : ''} registered successfully`,
      paymentDetails: {
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        studentCount: studentIds.length,
        country,
        includeCertification: includeCertification === 'true',
        eventId,
        sportId
      },
      registrationResults: {
        successful: successfulRegistrations.length,
        failed: failedRegistrations.length,
        details: registrationResults
      }
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process payment confirmation and registration',
      error: error.message
    });
  }
});

// Webhook endpoint for Stripe events (for production use)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    console.warn('Stripe webhook secret not configured');
    return res.status(400).send('Webhook secret not configured');
  }

  let event;

  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      // Handle successful payment
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      // Handle failed payment
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;