import api from './api';

// Description: Register an individual student for a sport with payment screenshot
// Endpoint: POST /api/registration/register
// Request: FormData with fields: studentId, sportId, eventId?, ageCategoryId, distanceId?, sportSubTypeId?, paymentScreenshot (file), transactionId?
// Response: { success: boolean, message: string, registration: object }
export const registerStudentWithPaymentScreenshot = async (formData: FormData) => {
  try {
    const response = await api.post('/api/registration/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error registering student with payment screenshot:', error);
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
    }
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Register a group of students for a sport with payment screenshot
// Endpoint: POST /api/registration/register
// Request: FormData with fields: sportId, eventId?, ageCategoryId, studentIds[], distanceId?, sportSubTypeId?, paymentScreenshot (file), transactionId?
// Response: { success: boolean, message: string, registration: object, studentCount: number }
export const registerGroupWithPaymentScreenshot = async (formData: FormData) => {
  try {
    const studentIds = formData.getAll('studentIds');
    formData.delete('studentIds');

    // Add each student ID separately
    studentIds.forEach(id => {
      formData.append('studentIds', id);
    });

    const response = await api.post('/api/registration/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error registering group with payment screenshot:', error);
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
    }
    throw new Error(error?.response?.data?.message || error.message);
  }
};