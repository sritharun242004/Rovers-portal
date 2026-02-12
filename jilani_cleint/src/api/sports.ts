import api from './api';

// Description: Get all sports
// Endpoint: GET /api/events/sports/all
// Request: {}
// Response: { success: boolean, sports: Array<{ _id: string, name: string, description: string, image: string, location: string }> }
export const getAllSports = async () => {
  try {
    const response = await api.get('/api/events/sports/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all sports:', error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get sports for a specific event
// Endpoint: GET /api/events/:id/sports
// Request: {}
// Response: { success: boolean, sports: Array<{ _id: string, name: string, description: string, image: string, location: string }> }
export const getSportsForEvent = async (eventId: string) => {
  try {
    const response = await api.get(`/api/events/${eventId}/sports`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sports for event ${eventId}:`, error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get list of all sports
// Endpoint: GET /api/sports
// Request: {}
// Response: {
//   sports: Array<{
//     _id: string,
//     name: string,
//     image: string,
//     description: string,
//     startDate: string,
//     endDate: string,
//     duration: string,
//     location: string,
//     address: string,
//     mapsPin: string,
//     registrationOpening: string,
//     registrationClosure: string
//   }>
// }
export const getSports = async () => {
  try {
    const response = await api.get('/api/sports');
    return response.data;
  } catch (error) {
    console.error('Error fetching sports:', error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get sport by ID
// Endpoint: GET /api/sports/:id
// Request: {}
// Response: {
//   sport: {
//     _id: string,
//     name: string,
//     image: string,
//     description: string,
//     startDate: string,
//     endDate: string,
//     duration: string,
//     location: string,
//     address: string,
//     mapsPin: string,
//     registrationOpening: string,
//     registrationClosure: string
//   }
// }
export const getSport = async (id: string) => {
  try {
    const response = await api.get(`/api/sports/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sport with ID ${id}:`, error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get sport details including age categories, distances, and subtypes
// Endpoint: GET /api/sports/:id
// Request: {}
// Response: {
//   success: boolean,
//   sport: {
//     _id: string,
//     name: string,
//     ageCategories: Array<{ _id: string, ageGroup: string }>,
//     distances: Array<{ _id: string, category: string, value: number, unit: string }>,
//     sportSubTypes: Array<{ _id: string, type: string }>
//   }
// }
export const getSportDetails = async (sportId: string) => {
  try {
    const response = await api.get(`/api/sports/${sportId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sport details for sport ${sportId}:`, error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get age categories for a sport
// Endpoint: GET /api/sports/:sportId/age-categories
// Request: {}
// Response: { ageCategories: Array<{ _id: string, ageGroup: string }> }
export const getSportAgeCategories = async (sportId: string) => {
  try {
    const response = await api.get(`/api/sports/${sportId}/age-categories`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching age categories for sport ${sportId}:`, error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get distances for a sport
// Endpoint: GET /api/sports/:sportId/distances
// Request: {}
// Response: { distances: Array<{ _id: string, category: string, value: number, unit: string }> }
export const getSportDistances = async (sportId: string) => {
  try {
    const response = await api.get(`/api/sports/${sportId}/distances`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching distances for sport ${sportId}:`, error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get subtypes for a sport
// Endpoint: GET /api/sports/:sportId/subtypes
// Request: {}
// Response: { subtypes: Array<{ _id: string, type: string }> }
export const getSportSubTypes = async (sportId: string) => {
  try {
    const response = await api.get(`/api/sports/${sportId}/subtypes`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching subtypes for sport ${sportId}:`, error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get eligible age categories based on DOB and sport
// Endpoint: POST /api/sports/eligible-age-categories
// Request: { dob: string, sportId: string }
// Response: { success: boolean, eligibleCategories: Array<{ _id: string, ageGroup: string }> }
export const getEligibleAgeCategoriesByDob = async (dob, sportId) => {
  try {
    const response = await api.post('/api/sports/eligible-age-categories', {
      dob,
      sportId
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching eligible age categories by DOB:', error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};