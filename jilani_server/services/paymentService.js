const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key_for_development');
const Sport = require('../models/Sport');

// Country-based pricing configuration
const PRICING_CONFIG = {
  malaysia: {
    currency: 'myr',
    registrationFee: 0, // Free
    certificationFee: 10000, // 100 MYR in cents
    name: 'Malaysia'
  },
  dubai: {
    currency: 'aed',
    registrationFee: 5500, // 55 AED in cents
    certificationFee: 20000, // 200 AED in cents
    name: 'Dubai (UAE)'
  },
  india: {
    currency: 'inr',
    registrationFee: 10000, // 100 INR in cents
    certificationFee: 20000, // 200 INR in cents
    name: 'India'
  }
};

class PaymentService {
  /**
   * Get pricing information for a country
   * @param {string} country - Country code (malaysia, dubai, india)
   * @returns {object} Pricing information
   */
  static getPricingByCountry(country) {
    const countryLower = String(country || '').trim().toLowerCase();

    // Alias map for common inputs
    const ALIASES = {
      ae: 'dubai', uae: 'dubai', 'united arab emirates': 'dubai', dubai: 'dubai',
      in: 'india', ind: 'india', india: 'india',
      my: 'malaysia', mys: 'malaysia', malaysia: 'malaysia'
    };

    const resolved = ALIASES[countryLower] || countryLower;

    if (!PRICING_CONFIG[resolved]) {
      // Fallback to India if unknown
      return PRICING_CONFIG.india;
    }

    return PRICING_CONFIG[resolved];
  }

  /**
   * Calculate total amount based on country and services selected
   * @param {string} country - Country code
   * @param {boolean} includeCertification - Whether to include certification fee
   * @param {number} studentCount - Number of students (default: 1)
   * @returns {object} Calculation details
   */
  static calculateAmount(country, includeCertification = false, studentCount = 1) {
    const pricing = this.getPricingByCountry(country);

    const registrationTotal = pricing.registrationFee * studentCount;
    const certificationTotal = includeCertification ? pricing.certificationFee * studentCount : 0;
    const totalAmount = registrationTotal + certificationTotal;

    return {
      country: pricing.name,
      currency: pricing.currency,
      studentCount,
      registrationFee: pricing.registrationFee,
      certificationFee: pricing.certificationFee,
      registrationTotal,
      certificationTotal,
      totalAmount,
      includeCertification,
      breakdown: {
        registration: {
          perStudent: pricing.registrationFee,
          total: registrationTotal,
          description: `Registration fee (${studentCount} student${studentCount > 1 ? 's' : ''})`
        },
        ...(includeCertification && {
          certification: {
            perStudent: pricing.certificationFee,
            total: certificationTotal,
            description: `Certification fee (${studentCount} student${studentCount > 1 ? 's' : ''})`
          }
        })
      }
    };
  }

  /**
   * Calculate total amount based on sport-specific pricing
   * @param {string} sportId - Sport ID or Sport object
   * @param {number} studentCount - Number of students (default: 1)
   * @returns {Promise<object>} Calculation details
   */
  static async calculateAmountBySport(sportId, studentCount = 1) {
    try {
      // Fetch sport from database if sportId is provided
      let sport;
      if (typeof sportId === 'string') {
        sport = await Sport.findById(sportId);
        if (!sport) {
          throw new Error(`Sport not found with ID: ${sportId}`);
        }
      } else if (sportId && sportId._id) {
        sport = sportId; // Already a sport object
      } else {
        throw new Error('Invalid sport ID or object provided');
      }

      const registrationFeePerStudent = sport.registrationFee || 0;
      const totalAmount = registrationFeePerStudent * studentCount;

      return {
        sportId: sport._id.toString(),
        sportName: sport.name,
        currency: 'myr', // All sport pricing is in Malaysian Ringgit
        studentCount,
        registrationFee: registrationFeePerStudent,
        totalAmount,
        breakdown: {
          registration: {
            perStudent: registrationFeePerStudent,
            total: totalAmount,
            description: `${sport.name} registration fee (${studentCount} student${studentCount > 1 ? 's' : ''})`
          }
        }
      };
    } catch (error) {
      console.error('Error calculating sport-based pricing:', error);
      throw error;
    }
  }

  /**
   * Get pricing information for a specific sport
   * @param {string} sportId - Sport ID
   * @returns {Promise<object>} Sport pricing information
   */
  static async getSportPricing(sportId) {
    try {
      const sport = await Sport.findById(sportId);
      if (!sport) {
        throw new Error(`Sport not found with ID: ${sportId}`);
      }

      return {
        sportId: sport._id.toString(),
        sportName: sport.name,
        currency: 'myr',
        registrationFee: sport.registrationFee || 0,
        registrationFeeDisplay: `RM ${((sport.registrationFee || 0) / 100).toFixed(2)}`
      };
    } catch (error) {
      console.error('Error fetching sport pricing:', error);
      throw error;
    }
  }

  /**
   * Create Stripe Payment Intent
   * @param {object} params - Payment parameters
   * @returns {object} Payment intent
   */
  static async createPaymentIntent({
    country,
    includeCertification = false,
    studentCount = 1,
    studentIds = [],
    eventId = null,
    sportId,
    userId,
    userEmail,
    metadata = {}
  }) {
    try {
      const calculation = this.calculateAmount(country, includeCertification, studentCount);

      // If total is 0 (like Malaysia registration only), return a mock success
      if (calculation.totalAmount === 0) {
        return {
          success: true,
          paymentRequired: false,
          clientSecret: null,
          calculation,
          message: 'Registration is free for this country'
        };
      }

      // Check if Stripe is properly configured
      if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder_key_for_development') {
        console.warn('Stripe secret key not configured - cannot process payments');
        return {
          success: false,
          paymentRequired: true,
          clientSecret: null,
          calculation,
          message: 'Payment processing is not available. Please configure Stripe keys or contact support.'
        };
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculation.totalAmount,
        currency: calculation.currency,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          country,
          studentCount: studentCount.toString(),
          includeCertification: includeCertification.toString(),
          // Store compact form to respect Stripe metadata limits
          studentIdsCsv: Array.isArray(studentIds) ? studentIds.join(',').slice(0, 450) : '',
          studentIdsCount: Array.isArray(studentIds) ? studentIds.length.toString() : '0',
          eventId: eventId || '',
          sportId: sportId || '',
          userId: userId || '',
          userEmail: userEmail || '',
          ...metadata
        },
        description: `Sports registration for ${studentCount} student${studentCount > 1 ? 's' : ''} in ${calculation.country}${includeCertification ? ' with certification' : ''}`,
        receipt_email: userEmail
      });

      return {
        success: true,
        paymentRequired: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        calculation
      };

    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error(`Payment intent creation failed: ${error.message}`);
    }
  }

  /**
   * Confirm and retrieve payment intent
   * @param {string} paymentIntentId - Payment intent ID
   * @returns {object} Payment intent details
   */
  static async getPaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error('Error retrieving payment intent:', error);
      throw new Error(`Failed to retrieve payment: ${error.message}`);
    }
  }

  /**
   * Get supported countries
   * @returns {array} List of supported countries
   */
  static getSupportedCountries() {
    return Object.keys(PRICING_CONFIG).map(key => ({
      code: key,
      name: PRICING_CONFIG[key].name,
      currency: PRICING_CONFIG[key].currency.toUpperCase(),
      registrationFee: PRICING_CONFIG[key].registrationFee / 100,
      certificationFee: PRICING_CONFIG[key].certificationFee / 100
    }));
  }

  /**
   * Format amount for display
   * @param {number} amountInCents - Amount in cents
   * @param {string} currency - Currency code
   * @returns {string} Formatted amount
   */
  static formatAmount(amountInCents, currency) {
    const amount = amountInCents / 100;
    const currencySymbols = {
      myr: 'RM',
      aed: 'AED',
      inr: '₹'
    };

    const symbol = currencySymbols[currency.toLowerCase()] || currency.toUpperCase();
    return `${symbol} ${amount.toFixed(2)}`;
  }
}

module.exports = PaymentService;