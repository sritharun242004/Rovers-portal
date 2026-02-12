import api from './api';
const VITE_API_URL = import.meta.env.VITE_API_URL;
// Description: Register a new volunteer
// Endpoint: POST /api/volunteer/register
// Request: { name: string, email: string, mobile: string }
// Response: { success: boolean, volunteer: { _id: string, name: string, email: string, mobile: string } }
export const registerVolunteer = async (data: { name: string; email: string; mobile: string }) => {
  try {
    const response = await api.post('/api/volunteer/register', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Login volunteer
// Endpoint: POST /api/auth/login
// Request: { email: string, password: string }
// Response: { success: boolean, accessToken: string, user: { _id: string, name: string, email: string, role: string }, checkpoint: string }
export const loginVolunteer = async (data: { email: string; password: string }) => {
  try {
    const response = await api.post('/api/auth/login', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get list of volunteers
// Endpoint: GET /api/volunteer
// Request: {}
// Response: { success: boolean, volunteers: Array<{ _id: string, name: string, email: string, mobile: string }> }
export const getVolunteers = async () => {
  try {

    const response = await api.get('/api/volunteer');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};