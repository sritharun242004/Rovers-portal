import api from './api';

// Description: Get a list of events
// Endpoint: GET /api/events
// Request: {}
// Response: { success: boolean, events: Array<{ _id: string, name: string, poster: string, description: string, startDate: string, endDate: string, sports: Array<{ _id: string, name: string }> }> }
export const getEvents = async () => {
  try {
    const response = await api.get('/api/events');
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get a single event by ID
// Endpoint: GET /api/events/:id
// Request: {}
// Response: { success: boolean, event: { _id: string, name: string, poster: string, description: string, startDate: string, endDate: string, sports: Array<{ _id: string, name: string }> } }
export const getEventById = async (id: string) => {
  try {
    const response = await api.get(`/api/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};