import api from './api';

// Description: Register a student for a sport
// Endpoint: POST /api/registration/register
// Request: { studentId: string, sportId: string, eventId?: string, ageCategoryId?: string, distanceId?: string, sportSubTypeId?: string }
// Response: { success: boolean, message: string, registration: object }
export const registerStudentForSport = async (data: {
  studentId: string;
  sportId: string;
  eventId?: string;
  ageCategoryId?: string;
  distanceId?: string;
  sportSubTypeId?: string;
}) => {
  try {
    const response = await api.post('/api/registration/register', data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get eligible age categories for a student and sport
// Endpoint: GET /api/registration/eligible-categories
// Request: { studentId: string, sportId: string }
// Response: { success: boolean, eligibleCategories: Array<{ _id: string, ageGroup: string, isEligible: boolean }> }
export const getEligibleAgeCategories = async (studentId: string, sportId: string) => {
  try {
    const params = new URLSearchParams();
    params.append('studentId', studentId);
    params.append('sportId', sportId);

    const response = await api.get(`/api/registration/eligible-categories?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching eligible age categories:', error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get registrations for logged-in parent
// Endpoint: GET /api/registration/parent-registrations
// Request: {}
// Response: { success: boolean, registrations: Array<Registration> }
export const getParentRegistrations = async () => {
  try {
    const response = await api.get('/api/registration/parent-registrations');
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Register a student for a specific event
// Endpoint: POST /api/registration/register
// Request: { studentId: string, sportId: string, eventId?: string, ageCategoryId?: string, distanceId?: string, sportSubTypeId?: string }
// Response: { success: boolean, message: string, registration: object }
export const registerStudent = async (data: {
  studentId: string;
  sportId: string;
  eventId?: string;
  ageCategoryId?: string;
  distanceId?: string;
  sportSubTypeId?: string;
}) => {
  try {
    const response = await api.post('/api/registration/register', data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get eligible students for registration
// Endpoint: GET /api/registration/eligible-students
// Request: { sportId: string, ageCategoryId?: string }
// Response: { success: boolean, isGroupSport: boolean, students: Array<{ _id: string, name: string, photo: string, uid: string, dob: string, gender: string, isEligible: boolean, isRegistered: boolean, age: number }>, minRequired: number }
export const getEligibleStudents = async (sportId: string, ageCategoryId?: string) => {
  try {
    const params = new URLSearchParams();
    params.append('sportId', sportId);
    if (ageCategoryId) {
      params.append('ageCategoryId', ageCategoryId);
    }

    const response = await api.get(`/api/registration/eligible-students?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching eligible students:', error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Register students for a sport with payment screenshot
// Endpoint: POST /api/registration/register
// Request: FormData with fields for registration details, payment screenshot, isGroupSport flag, and substitutes
// Response: { success: boolean, message: string, registration: object, isGroupRegistration: boolean, studentCount: number }
export const registerStudentsForSport = async (formData: any) => {
  try {
    // Check if formData is actually FormData
    if (!(formData instanceof FormData)) {
      const data = formData;
      formData = new FormData();

      // Add all fields from data to FormData
      Object.keys(data).forEach(key => {
        if ((key === 'studentIds' || key === 'substitutes') && Array.isArray(data[key])) {
          // Handle arrays properly - especially for studentIds and substitutes
          data[key].forEach(id => formData.append(key, id));
        } else {
          formData.append(key, data[key]);
        }
      });

      // Make sure to add the isGroupSport flag if it exists
      if (data.isGroupSport !== undefined) {
        formData.append('isGroupSport', data.isGroupSport.toString());
      }
    }

    const response = await api.post('/api/registration/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get registration details by ID
// Endpoint: GET /api/registration/registration/:id
// Request: { id: string }
// Response: { success: boolean, registration: object, groupStudents: Array<object> }
export const getRegistrationDetails = async (registrationId: string) => {
  try {
    const response = await api.get(`/api/registration/registration/${registrationId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting registration details:', error);
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
    }
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get detailed information for a specific registration
// Endpoint: GET /api/registration/registration-details/:id
// Request: {}
// Response: {
//   success: boolean,
//   registration: Object,
//   participants: Array<Object>,
//   location: string,
//   address: string,
//   paymentScreenshot: string
// }
export const getDetailedRegistrationInfo = async (registrationId: string) => {
  try {
    const response = await api.get(`/api/registration/registration-details/${registrationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching registration details:', error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Verify school by unique code and get school details
// Endpoint: GET /api/registration/verify-school-code/:uniqueCode
// Request: { uniqueCode: string }
// Response: { success: boolean, school: object }
export const verifySchoolCode = async (uniqueCode: string) => {
  try {
    const response = await api.get(`/api/registration/verify-school-code/${uniqueCode}`);
    return response.data;
  } catch (error) {
    console.error('Error verifying school code:', error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Keep the mock functions for development/testing if needed, but they should not be used in production
export const mockRegisterStudentForSport = (data: {
  studentId: string;
  sportId: string;
  eventId?: string;
  ageCategoryId?: string;
  distanceId?: string;
  sportSubTypeId?: string;
}) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Student registered successfully',
        registration: { ...data, _id: '123456' }
      });
    }, 500);
  });
};

// Mocking the eligible age categories function for development
export const mockGetEligibleAgeCategories = (studentId: string, sportId: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        eligibleCategories: [
          { _id: '1', ageGroup: 'Under 7', isEligible: true },
          { _id: '2', ageGroup: 'Under 9', isEligible: true },
          { _id: '3', ageGroup: 'Under 11', isEligible: false },
          { _id: '4', ageGroup: 'Under 13', isEligible: false },
          { _id: '5', ageGroup: 'Under 15', isEligible: false },
          { _id: '6', ageGroup: 'Under 17', isEligible: false }
        ]
      });
    }, 500);
  });
};

// Mocking the parent registrations function for development
export const mockGetParentRegistrations = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        registrations: [
          {
            _id: '1',
            student: { _id: 'student1', name: 'John Doe', photo: 'https://via.placeholder.com/150', uid: 'ST12345' },
            sport: { _id: 'sport1', name: 'Football' },
            event: { _id: 'event1', name: 'Summer Olympics 2023' },
            ageCategory: { _id: 'age1', ageGroup: 'Under 9' },
            distance: { _id: 'dist1', category: '100m' },
            sportSubType: { _id: 'subtype1', type: 'POOMSAE' },
            status: 'pending',
            createdAt: new Date().toISOString()
          },
          {
            _id: '2',
            student: { _id: 'student2', name: 'Jane Smith', photo: 'https://via.placeholder.com/150', uid: 'ST67890' },
            sport: { _id: 'sport2', name: 'Swimming' },
            event: { _id: 'event2', name: 'Dubai Sports Festival' },
            ageCategory: { _id: 'age2', ageGroup: 'Under 11' },
            distance: { _id: 'dist2', category: '50m' },
            status: 'approved',
            createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
          }
        ]
      });
    }, 500);
  });
};

// Description: Bulk register multiple students for a sport
// Endpoint: POST /api/registration/bulk-register
// Request: { studentIds: string[], sportId: string, eventId?: string, paymentIntentId?: string }
// Response: { success: boolean, message: string, data: { registeredCount: number, registrations: object[] } }
export const bulkRegisterStudents = async (data: {
  studentIds: string[];
  sportId: string;
  eventId?: string;
  paymentIntentId?: string;
}) => {
  try {
    const response = await api.post('/api/registration/bulk-register', data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Send parent notification for payment
// Endpoint: POST /api/registration/notify-parents
// Request: { studentIds: string[], eventId: string, sportId: string }
// Response: { success: boolean, message: string, data: { emailsSent: number, studentsCount: number } }
export const notifyParentsForPayment = async (data: {
  studentIds: string[];
  eventId: string;
  sportId: string;
}) => {
  try {
    const response = await api.post('/api/registration/notify-parents', data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};