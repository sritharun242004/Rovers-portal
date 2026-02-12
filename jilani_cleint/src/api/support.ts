import api from './api';

// Description: Submit a support query
// Endpoint: POST /api/parent/queries
// Request: { studentId?: string, subject: string, message: string }
// Response: { success: boolean, message: string, query: Object }
export const submitQuery = async (data: {
  studentId?: string;
  subject: string;
  details: string;
}) => {
  try {
    // Convert from 'details' field expected by frontend to 'message' expected by backend
    const requestData = {
      subject: data.subject,
      message: data.details // Map 'details' from form to 'message' for API
    };

    // Only add studentId if it's provided and valid
    if (data.studentId && data.studentId !== 'general') {
      requestData.studentId = data.studentId;
    }
    const response = await api.post('/api/parent/queries', requestData);
    return response.data;
  } catch (error) {
    console.error('Error submitting query:', error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get all FAQs
// Endpoint: GET /api/faqs
// Request: {}
// Response: { success: boolean, faqs: Array<{ question: string, answer: string, sport?: string }> }
export const getCommonFAQs = async () => {
  try {
    const response = await api.get('/api/faqs');
    return response.data;
  } catch (error) {
    console.error('Error getting FAQs:', error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};