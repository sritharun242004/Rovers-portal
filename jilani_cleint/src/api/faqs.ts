import api from './api';

// Description: Get FAQs for a specific sport
// Endpoint: GET /api/faqs/sport/:sportId
// Request: {}
// Response: { success: boolean, faqs: Array<{ _id: string, question: string, answer: string, order: number }> }
export const getSportFAQs = async (sportId: string) => {
  try {
    const response = await api.get(`/api/faqs/sport/${sportId}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get all FAQs
// Endpoint: GET /api/faqs
// Request: {}
// Response: { success: boolean, faqs: Array<{ question: string, answer: string, sport?: string }> }
export const getFAQs = async () => {
  try {
    const response = await api.get('/api/faqs');
    return response.data;
  } catch (error) {
    console.error('API: Error fetching all FAQs:', error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Mock data for frontend development
const mockFAQs = [
  {
    _id: '1',
    question: "What age groups are eligible for this sport?",
    answer: "We have various age categories ranging from Under 7 to Under 17. The specific age eligibility depends on the event date and your date of birth.",
    order: 1
  },
  {
    _id: '2',
    question: "What equipment do I need to bring?",
    answer: "The required equipment varies by sport. For detailed information, please check the equipment list in your registration confirmation email or contact the event organizers.",
    order: 2
  },
  {
    _id: '3',
    question: "Is there a fee to participate?",
    answer: "Yes, registration fees vary by sport and event. The exact amount will be displayed during the registration process before payment.",
    order: 3
  },
  {
    _id: '4',
    question: "Can I register for multiple sports?",
    answer: "Yes, students can register for multiple sports as long as there are no scheduling conflicts between events.",
    order: 4
  },
  {
    _id: '5',
    question: "What happens if I need to cancel my registration?",
    answer: "Please contact support at least 48 hours before the event for cancellation and refund information. Refund policies may vary by event.",
    order: 5
  }
];

// Mock implementation for frontend development
export const getMockSportFAQs = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        faqs: mockFAQs
      });
    }, 500);
  });
};

// Description: Seed dummy FAQs for a sport (admin only)
// Endpoint: POST /api/faqs/seed/:sportId
// Request: {}
// Response: { success: boolean, message: string, count: number, faqs: Array<{ _id: string, question: string, answer: string, order: number }> }
export const seedSportFAQs = async (sportId: string) => {
  try {
    const response = await api.post(`/api/faqs/seed/${sportId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};