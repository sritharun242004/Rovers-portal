import api from './api';
import { AxiosError } from 'axios';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

// Description: Get list of students with filters
// Endpoint: GET /api/students
// Request: { search?: string, sport?: string, status?: string }
// Response: { success: boolean, students: Array<{ _id: string, name: string, uid: string, sport: string, location: string, status: string }> }
export const getStudents = async (filters?: { search?: string; sport?: string; status?: string }) => {
  try {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sport && filters.sport !== 'all') params.append('sport', filters.sport);
    if (filters?.status) params.append('status', filters.status);

    const response = await api.get(`/api/students?${params.toString()}`);
    return response.data;
  } catch (error) {
    const apiError = error as AxiosError<ApiError>;
    throw new Error(apiError.response?.data?.message || apiError.message || 'Failed to fetch students');
  }
};

// Description: Get list of available sports
// Endpoint: GET /api/students/sports
// Request: {}
// Response: { success: boolean, sports: string[] }
export const getSports = async () => {
  try {
    const response = await api.get('/api/students/sports');
    return response.data;
  } catch (error) {
    const apiError = error as AxiosError<ApiError>;
    throw new Error(apiError.response?.data?.message || apiError.message || 'Failed to fetch sports');
  }
};

// Get filterable students with comprehensive filtering
export const getFilterableStudents = async (params: {
  sportId?: string;
  sportSubTypeId?: string;
  ageCategoryId?: string;
  distanceId?: string;
  search?: string;
  page?: number;
  limit?: number;
  eventId?: string;
}) => {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await api.get(`/api/students/filterable?${queryParams}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Get filter options for student filtering
export const getStudentFilterOptions = async () => {
  try {
    const response = await api.get('/api/students/filter-options');
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Get sport details with associated filters
export const getSportDetails = async (sportId: string) => {
  try {
    const response = await api.get(`/api/students/sports/${sportId}/details`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};