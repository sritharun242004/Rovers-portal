const express = require('express');
const { requireUser } = require('./middleware/auth');
const FAQService = require('../services/faqService');

const router = express.Router();

// GET /api/faqs - Get all FAQs
router.get('/', async (req, res,next) => {
  try {
    console.log('=== GET ALL FAQS API CALLED ===');
    const FAQ = require('../models/FAQ');
    const faqs = await FAQ.find().sort({ order: 1 });
    console.log(`Found ${faqs.length} FAQs`);

    return res.json({
      success: true,
      faqs
    });
  } catch (error) {
    next(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get FAQs for a specific sport
router.get('/sport/:sportId', async (req, res,next) => {
  try {
    const { sportId } = req.params;
    const faqs = await FAQService.getSportFAQs(sportId);
    return res.json({
      success: true,
      faqs
    });
  } catch (error) {
    next(error)
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add a new FAQ (admin/manager only)
router.post('/', requireUser, async (req, res,next) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Only managers can add FAQs'
      });
    }

    const { sportId, question, answer, order } = req.body;

    if (!sportId || !question || !answer) {
      return res.status(400).json({
        success: false,
        message: 'Sport ID, question, and answer are required'
      });
    }

    const faq = await FAQService.addFAQ(sportId, question, answer, order);
    return res.status(201).json({
      success: true,
      message: 'FAQ added successfully',
      faq
    });
  } catch (error) {
    next(error)
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update an existing FAQ (admin/manager only)
router.put('/:id', requireUser, async (req, res,next) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Only managers can update FAQs'
      });
    }

    const { id } = req.params;
    const data = req.body;

    const faq = await FAQService.updateFAQ(id, data);
    return res.json({
      success: true,
      message: 'FAQ updated successfully',
      faq
    });
  } catch (error) {
    next(error)
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete an FAQ (admin/manager only)
router.delete('/:id', requireUser, async (req, res,next) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Only managers can delete FAQs'
      });
    }

    const { id } = req.params;
    const result = await FAQService.deleteFAQ(id);

    return res.json({
      success: true,
      message: 'FAQ deleted successfully'
    });
  } catch (error) {
    next(error)
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Seed dummy FAQs for a sport
router.post('/seed/:sportId', requireUser, async (req, res,next) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Only managers can seed FAQs'
      });
    }

    const { sportId } = req.params;
    const faqs = await FAQService.seedDummyFAQs(sportId);

    return res.json({
      success: true,
      message: 'Dummy FAQs seeded successfully',
      count: faqs.length,
      faqs
    });
  } catch (error) {
    next(error)
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Seed FAQs (this can be accessed by admins or during development)
router.post('/seed', async (req, res,next) => {
  try {
    console.log('=== SEEDING FAQS ===');
    const FAQ = require('../models/FAQ');

    // Check if there are existing FAQs
    const existingCount = await FAQ.countDocuments();
    console.log(`Found ${existingCount} existing FAQs`);

    // Only seed if there are no FAQs
    if (existingCount === 0) {
      // Common FAQs not specific to any sport
      const commonFAQs = [
        {
          question: "What should my child wear to the event?",
          answer: "Comfortable sportswear appropriate for the specific sport. Details will be provided in the pre-event information email.",
          order: 1
        },
        {
          question: "How early should we arrive before the event starts?",
          answer: "We recommend arriving at least 30 minutes before your scheduled time to complete check-in procedures.",
          order: 2
        },
        {
          question: "Is water provided or should we bring our own?",
          answer: "While water stations will be available, we recommend bringing a personal water bottle to stay hydrated throughout the event.",
          order: 3
        },
        {
          question: "What is the refund policy if we cannot attend?",
          answer: "Refunds are available up to 7 days before the event. After that, we can offer credit toward future events.",
          order: 4
        },
        {
          question: "Are parents allowed to stay and watch?",
          answer: "Yes, we encourage parent support! Designated viewing areas will be clearly marked at each venue.",
          order: 5
        }
      ];

      // Insert common FAQs
      await FAQ.insertMany(commonFAQs);
      console.log(`Added ${commonFAQs.length} common FAQs`);

      // Get sport with ID if provided
      const sportId = req.body.sportId;
      if (sportId) {
        // Sport-specific FAQs if a sport ID is provided
        const Sport = require('../models/Sport');
        const sport = await Sport.findById(sportId);

        if (sport) {
          const sportFAQs = [
            {
              sportId: sport._id,
              question: `What equipment is needed for ${sport.name}?`,
              answer: `For ${sport.name}, participants should bring appropriate footwear and sportswear. Specialized equipment will be provided at the venue.`,
              order: 1
            },
            {
              sportId: sport._id,
              question: `How long does the ${sport.name} event typically last?`,
              answer: `${sport.name} events usually last between 2-3 hours, including warm-up, competition, and awards ceremony.`,
              order: 2
            },
            {
              sportId: sport._id,
              question: `What age groups compete together in ${sport.name}?`,
              answer: `In ${sport.name}, we organize competitions by age categories to ensure fair play. Please refer to the event details for specific groupings.`,
              order: 3
            }
          ];

          await FAQ.insertMany(sportFAQs);
          console.log(`Added ${sportFAQs.length} sport-specific FAQs for ${sport.name}`);
        }
      } else {
        // Seed FAQs for all sports if no specific sport ID is provided
        const Sport = require('../models/Sport');
        const sports = await Sport.find();

        let sportSpecificFAQs = [];

        // For each sport, create specific FAQs
        for (const sport of sports) {
          // Add sport-specific FAQs
          sportSpecificFAQs.push({
            sportId: sport._id,
            question: `What equipment is needed for ${sport.name}?`,
            answer: `For ${sport.name}, participants should bring appropriate footwear and sportswear. Specialized equipment will be provided at the venue.`,
            order: 1
          });

          sportSpecificFAQs.push({
            sportId: sport._id,
            question: `How long does the ${sport.name} event typically last?`,
            answer: `${sport.name} events usually last between 2-3 hours, including warm-up, competition, and awards ceremony.`,
            order: 2
          });

          sportSpecificFAQs.push({
            sportId: sport._id,
            question: `What age groups compete together in ${sport.name}?`,
            answer: `In ${sport.name}, we organize competitions by age categories to ensure fair play. Please refer to the event details for specific groupings.`,
            order: 3
          });
        }

        // Insert sport-specific FAQs
        if (sportSpecificFAQs.length > 0) {
          await FAQ.insertMany(sportSpecificFAQs);
          console.log(`Added ${sportSpecificFAQs.length} sport-specific FAQs`);
        }
      }
    }

    const totalFAQs = await FAQ.countDocuments();
    console.log(`Total FAQs in database: ${totalFAQs}`);

    return res.json({
      success: true,
      message: `FAQ database seeded successfully with ${totalFAQs} FAQs`,
      count: totalFAQs
    });
  } catch (error) {
    next(error)
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;