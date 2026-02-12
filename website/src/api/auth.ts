import api from './api';
const VITE_API_URL = import.meta.env.VITE_API_URL;

// Description: Request OTP for login
// Endpoint: POST /api/auth/request-otp
// Request: { email: string }
// Response: { success: boolean, message: string, requireOTP: boolean }
export const requestOTP = async (email: string) => {
  try {
    const response = await api.post('/api/auth/request-otp', { email });
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Verify OTP and login
// Endpoint: POST /api/auth/verify-otp
// Request: { email: string, otp: string }
// Response: { success: boolean, accessToken: string, refreshToken: string, role: string }
export const verifyOTP = async (email: string, otp: string) => {
  try {
    const response = await api.post('/api/auth/verify-otp', { email, otp });
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Login user with either OTP or password
// Endpoint: POST /api/auth/login
// Request: { email: string, password?: string }
// Response: { success: boolean, message: string, requireOTP?: boolean, user?: any, accessToken?: string, refreshToken?: string }
export const login = async (email: string, password?: string) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Request OTP for signup
// Endpoint: POST /api/auth/signup/request-otp
// Request: { email: string }
// Response: { success: boolean, message: string }
export const requestSignupOTP = async (email: string) => {
  try {
    const response = await api.post('/api/auth/signup/request-otp', { email });
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Verify OTP for signup
// Endpoint: POST /api/auth/signup/verify-otp
// Request: { email: string, otp: string }
// Response: { success: boolean, message: string }
export const verifySignupOTP = async (email: string, otp: string) => {
  try {
    const response = await api.post('/api/auth/signup/verify-otp', { email, otp });
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Complete signup with user details
// Endpoint: POST /api/auth/signup/complete
// Request: { email: string, name: string, role: string, ... }
// Response: { success: boolean, message: string, user: Object, accessToken: string, refreshToken: string }
export const completeSignup = async (userData: any) => {
  try {
    const response = await api.post('/api/auth/signup/complete', userData);
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get available sports for school signup
// Endpoint: GET /api/auth/signup/sports
// Request: {}
// Response: { success: boolean, sports: Array<{ _id: string, name: string }> }
export const getSignupSports = async () => {
  try {
    const response = await api.get('/api/auth/signup/sports');
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Register user
// Endpoint: POST /api/auth/register
// Request: { email: string, password: string, name: string, role: string }
// Response: { success: boolean, message: string }
export const register = async (email: string, password: string, name: string, role: string) => {
  try {
    const response = await api.post('/api/auth/register', { email, password, name, role });
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Logout user
// Endpoint: POST /api/auth/logout
// Request: {}
// Response: { success: boolean }
export const logout = async () => {
  try {
    const response = await api.post('/api/auth/logout');
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

export interface LoginResponse {
  message: string;
  user?: {
    _id: string;
    email: string;
    name: string;
    role: 'manager' | 'volunteer' | 'parent' | 'school';
    checkpoint?: string;
  };
  accessToken?: string;
  refreshToken?: string;
  requireOTP?: boolean;
  requiresPasswordSetup?: boolean;
}

export const authApi = {
  async login(email: string, password?: string): Promise<LoginResponse> {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async setupPassword(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/auth/setup-password', { email, password });
    return response.data;
  },

  async verifyOTP(email: string, otp: string): Promise<LoginResponse> {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  }
};