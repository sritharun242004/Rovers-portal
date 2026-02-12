import axios, { AxiosRequestConfig, AxiosError } from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL;
const MAX_RETRIES = 5;
const RETRY_DELAY = 1000; // 2 seconds

// Create axios instance with configuration
const api = axios.create({
  baseURL: VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => {
    return status >= 200 && status < 300;
  },
  timeout: 60000, // 60 second timeout
});

// Add a request interceptor to include the auth token and log requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Enhanced request logging
  console.log('Making request:', {
    url: config.url,
    method: config.method,
    baseURL: config.baseURL,
    headers: config.headers,
    timeout: config.timeout,
    timestamp: new Date().toISOString()
  });
  
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Add a response interceptor to handle errors with enhanced logging
api.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log('Request successful:', {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      timestamp: new Date().toISOString()
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Enhanced error logging with more details
    console.error('API Error Details:', {
      url: originalRequest?.url,
      method: originalRequest?.method,
      baseURL: originalRequest?.baseURL,
      timeout: originalRequest?.timeout,
      headers: originalRequest?.headers,
      errorMessage: error.message,
      errorCode: error.code,
      errorName: error.name,
      isAxiosError: error.isAxiosError,
      isNetworkError: error.message?.includes('Network Error'),
      isTimeoutError: error.code === 'ECONNABORTED',
      timestamp: new Date().toISOString(),
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      } : null
    });
    
    // If the error is a network error and we haven't exceeded max retries
    if (error.message.includes('Network Error') && 
        (!originalRequest._retryCount || originalRequest._retryCount < MAX_RETRIES)) {
      
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      
      // Log retry attempt with more details
      console.log(`Retrying request (${originalRequest._retryCount}/${MAX_RETRIES}):`, {
        url: originalRequest.url,
        method: originalRequest.method,
        attempt: originalRequest._retryCount,
        previousError: error.message,
        timestamp: new Date().toISOString()
      });
      
      // Exponential backoff: wait longer between each retry
      const backoffDelay = RETRY_DELAY * Math.pow(2, originalRequest._retryCount - 1);
      await delay(backoffDelay);
      
      // Retry the request
      return api(originalRequest);
    }
    
    // Enhanced error information for different types of errors
    if (error.response) {
      // Server responded with error status
      console.error('Response Error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        url: error.config?.url,
        method: error.config?.method,
        timestamp: new Date().toISOString()
      });
    } else if (error.request) {
      // No response received
      console.error('Request Error:', {
        request: error.request,
        url: error.config?.url,
        method: error.config?.method,
        timeout: error.config?.timeout,
        headers: error.config?.headers,
        timestamp: new Date().toISOString()
      });
    } else {
      // Request setup error
      console.error('Error:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    }
    
    return Promise.reject(error);
  }
);

// Helper function to make API calls with better error handling
export const apiCall = async (config: AxiosRequestConfig) => {
  try {
    return await api(config);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes('Network Error')) {
        console.error('Network error occurred:', {
          message: error.message,
          url: (error as AxiosError).config?.url,
          method: (error as AxiosError).config?.method,
          baseURL: (error as AxiosError).config?.baseURL,
          timeout: (error as AxiosError).config?.timeout,
          headers: (error as AxiosError).config?.headers,
          timestamp: new Date().toISOString()
        });
      }
      // Add user-friendly error message with more context
      throw new Error(
        error.message.includes('Network Error') 
          ? 'Unable to connect to the server. Please check your internet connection and try again. If the problem persists, try refreshing the page or clearing your browser cache.'
          : error.message
      );
    }
    throw error;
  }
};

export default api;