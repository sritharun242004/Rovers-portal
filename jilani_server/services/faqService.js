const FAQ = require('../models/FAQ');
const Sport = require('../models/Sport');
const mongoose = require('mongoose');

class FAQService {
  // Get FAQs for a specific sport
  static async getSportFAQs(sportId) {
    try {
      // Validate sportId
      if (!mongoose.Types.ObjectId.isValid(sportId)) {
        throw new Error('Invalid sport ID');
      }

      // Find the sport
      const sport = await Sport.findById(sportId);
      if (!sport) {
        throw new Error('Sport not found');
      }

      // Get FAQs for this sport, ordered by 'order' field
      const faqs = await FAQ.find({ sport: sportId })
        .sort({ order: 1 })
        .lean();

      return faqs;
    } catch (error) {
      console.error('Error getting sport FAQs:', error);
      throw new Error(`Failed to get FAQs: ${error.message}`);
    }
  }

  // Add a new FAQ item
  static async addFAQ(sportId, question, answer, order = 0) {
    try {
      // Validate sportId
      if (!mongoose.Types.ObjectId.isValid(sportId)) {
        throw new Error('Invalid sport ID');
      }

      // Find the sport
      const sport = await Sport.findById(sportId);
      if (!sport) {
        throw new Error('Sport not found');
      }

      // Create and save the new FAQ
      const faq = new FAQ({
        sport: sportId,
        question,
        answer,
        order
      });

      await faq.save();
      return faq;
    } catch (error) {
      console.error('Error adding FAQ:', error);
      throw new Error(`Failed to add FAQ: ${error.message}`);
    }
  }

  // Seed dummy FAQs for a sport
  static async seedDummyFAQs(sportId) {
    try {
      // Validate sportId
      if (!mongoose.Types.ObjectId.isValid(sportId)) {
        throw new Error('Invalid sport ID');
      }

      // Find the sport
      const sport = await Sport.findById(sportId);
      if (!sport) {
        throw new Error('Sport not found');
      }

      // Check if FAQs already exist for this sport
      const existingFaqs = await FAQ.find({ sport: sportId });
      if (existingFaqs.length > 0) {
        return existingFaqs; // Don't seed if FAQs already exist
      }

      // Common FAQs that could apply to any sport
      const dummyFAQs = [
        {
          question: "What age groups are eligible for this sport?",
          answer: "We have various age categories ranging from Under 7 to Under 17. The specific age eligibility depends on the event date and your date of birth.",
          order: 1
        },
        {
          question: "What equipment do I need to bring?",
          answer: "The required equipment varies by sport. For detailed information, please check the equipment list in your registration confirmation email or contact the event organizers.",
          order: 2
        },
        {
          question: "Is there a fee to participate?",
          answer: "Yes, registration fees vary by sport and event. The exact amount will be displayed during the registration process before payment.",
          order: 3
        },
        {
          question: "Can I register for multiple sports?",
          answer: "Yes, students can register for multiple sports as long as there are no scheduling conflicts between events.",
          order: 4
        },
        {
          question: "What happens if I need to cancel my registration?",
          answer: "Please contact support at least 48 hours before the event for cancellation and refund information. Refund policies may vary by event.",
          order: 5
        }
      ];

      // Create and save all the dummy FAQs
      const createdFAQs = await Promise.all(
        dummyFAQs.map(async (faq) => {
          const newFAQ = new FAQ({
            sport: sportId,
            question: faq.question,
            answer: faq.answer,
            order: faq.order
          });
          return await newFAQ.save();
        })
      );

      return createdFAQs;
    } catch (error) {
      console.error('Error seeding dummy FAQs:', error);
      throw new Error(`Failed to seed FAQs: ${error.message}`);
    }
  }

  // Update an existing FAQ
  static async updateFAQ(faqId, data) {
    try {
      // Validate faqId
      if (!mongoose.Types.ObjectId.isValid(faqId)) {
        throw new Error('Invalid FAQ ID');
      }

      // Find and update the FAQ
      const faq = await FAQ.findByIdAndUpdate(
        faqId,
        { $set: data },
        { new: true }
      );

      if (!faq) {
        throw new Error('FAQ not found');
      }

      return faq;
    } catch (error) {
      console.error('Error updating FAQ:', error);
      throw new Error(`Failed to update FAQ: ${error.message}`);
    }
  }

  // Delete an FAQ
  static async deleteFAQ(faqId) {
    try {
      // Validate faqId
      if (!mongoose.Types.ObjectId.isValid(faqId)) {
        throw new Error('Invalid FAQ ID');
      }

      // Find and delete the FAQ
      const result = await FAQ.findByIdAndDelete(faqId);

      if (!result) {
        throw new Error('FAQ not found');
      }

      return { success: true, message: 'FAQ deleted successfully' };
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      throw new Error(`Failed to delete FAQ: ${error.message}`);
    }
  }
}

module.exports = FAQService;