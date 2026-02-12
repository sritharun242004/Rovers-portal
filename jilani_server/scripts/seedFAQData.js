const mongoose = require('mongoose');
require('dotenv').config();
const FAQ = require('../models/FAQ');

const seedFAQs = async () => {
  try {
    console.log('=== SEEDING FAQ DATA ===');

    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL);

    console.log('Connected to MongoDB');

    // Clear existing FAQs
    await FAQ.deleteMany({});
    console.log('Cleared existing FAQs');

    // Common FAQs not specific to any sport
    const commonFAQs = [
      {
        sportId: null,
        question: "What should my child wear to the event?",
        answer: "Comfortable sportswear appropriate for the specific sport. Details will be provided in the pre-event information email.",
        order: 1
      },
      {
        sportId: null,
        question: "How early should we arrive before the event starts?",
        answer: "We recommend arriving at least 30 minutes before your scheduled time to complete check-in procedures.",
        order: 2
      },
      {
        sportId: null,
        question: "Is water provided or should we bring our own?",
        answer: "While water stations will be available, we recommend bringing a personal water bottle to stay hydrated throughout the event.",
        order: 3
      },
      {
        sportId: null,
        question: "What is the refund policy if we cannot attend?",
        answer: "Refunds are available up to 7 days before the event. After that, we can offer credit toward future events.",
        order: 4
      },
      {
        sportId: null,
        question: "Are parents allowed to stay and watch?",
        answer: "Yes, we encourage parent support! Designated viewing areas will be clearly marked at each venue.",
        order: 5
      }
    ];

    // Insert common FAQs
    await FAQ.insertMany(commonFAQs);
    console.log(`Added ${commonFAQs.length} common FAQs`);

    // Get all sports to create sport-specific FAQs
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
    await FAQ.insertMany(sportSpecificFAQs);
    console.log(`Added ${sportSpecificFAQs.length} sport-specific FAQs`);

    const totalFAQs = await FAQ.countDocuments();
    console.log(`Total FAQs in database: ${totalFAQs}`);

    console.log('FAQ seeding completed successfully');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

  } catch (error) {
    console.error('Error seeding FAQs:', error);
    process.exit(1);
  }
};

// Execute the seeding function
seedFAQs();