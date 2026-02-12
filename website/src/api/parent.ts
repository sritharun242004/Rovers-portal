import api from './api';
import axios, { AxiosError } from 'axios';

// Description: Get children for logged-in parent
// Endpoint: GET /api/parent/children
// Request: {}
// Response: { success: boolean, children: Array<{ _id: string, name: string, uid: string, sport: string, location: string, status: string, photo: string, dob: string, inlineCategory: string }> }
export interface GetParentChildrenParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface GetParentChildrenResponse {
  success: boolean;
  children: Array<{
    _id: string;
    name: string;
    uid: string;
    sport: string;
    location: string;
    status: string;
    photo: string;
    dob: string | null;
    gender: string;
    nationality: string;
    city: string;
    represents: string;
    class: string;
    bloodGroup: string;
    relationship: string;
    isRegistered?: boolean;
    registrationCount?: number;
  }>;
  pagination: PaginationInfo;
}

export const getParentChildren = async (params: GetParentChildrenParams = {}): Promise<GetParentChildrenResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);

    const response = await api.get(`/api/parent/children?${queryParams.toString()}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching parent children:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch children");
  }
};

// Description: Link child to parent by student UID
// Endpoint: POST /api/parent/link-child
// Request: { studentUid: string, relationship?: string }
// Response: { success: boolean, message: string, student: { _id: string, name: string, uid: string } }
export const linkChildToParent = async (studentUid: string, relationship?: string) => {
  try {
    const response = await api.post('/api/parent/link-child', {
      studentUid,
      relationship
    });
    return response.data;
  } catch (error) {
    console.error(error);
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error('An unknown error occurred');
  }
};

// Description: Submit a parent query
// Endpoint: POST /api/parent/queries
// Request: { studentId: string, subject: string, message: string }
// Response: { success: boolean, message: string, query: Object }
export const submitParentQuery = async (studentId: string, subject: string, message: string) => {
  try {
    const response = await api.post('/api/parent/queries', {
      studentId,
      subject,
      message
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Upload student photo
// Endpoint: POST /api/parent/upload-photo/:studentId
// Request: FormData with 'photo' file
// Response: { success: boolean, message: string, student: { _id: string, name: string, photo: string } }
export const uploadStudentPhoto = async (studentId: string, photoFile: File) => {
  try {
    const formData = new FormData();
    formData.append('photo', photoFile);

    const response = await api.post(`/api/parent/upload-photo/${studentId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get all queries for logged-in parent
// Endpoint: GET /api/parent/queries
// Request: {}
// Response: { success: boolean, queries: Array<{ _id: string, student: { name: string, uid: string }, subject: string, message: string, status: string, response: string, createdAt: string }> }
export const uploadPrentData = async () => {
  const response = await api.post('/api/parent/upload-parent-data');
  return response.data;
}
export const getParentQueries = async () => {
  try {
    const response = await api.get('/api/parent/queries');
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Add a new student with enhanced validation and auto-calculated age category
// Endpoint: POST /api/parent/add-student
// Request: FormData with student fields including name, dob, gender, nationality, city, uid, represents, class, bloodGroup, relationship, medicalConditions, photo, idProof, sport, distance, sportSubType
// Response: { success: boolean, message: string, student: Student }
export const addStudent = async (formData) => {
  try {
    const response = await api.post('/api/parent/add-student', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding student:', error);
    console.error('Error response:', error.response?.data);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Add a new student with expanded details including sports start/end dates
// Endpoint: POST /api/parent/add-student-expanded
// Request: FormData with student details including name, dob, gender, nationality, sports details with start/end dates
// Response: { success: boolean, message: string, student: object }
export const addStudentExpanded = async (formData) => {
  try {
    const response = await api.post('/api/parent/add-student-expanded', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding student with expanded details:', error);
    console.error('Error response:', error.response?.data);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  student?: T;
}

interface Student {
  _id: string;
  name: string;
  photo?: string;
  [key: string]: any;
}

// Description: Update an existing student
// Endpoint: PUT /api/parent/students/:studentId
// Request: FormData with updated student details
// Response: { success: boolean, message: string, student: object }
export const updateStudent = async (studentId: string, formData: FormData): Promise<ApiResponse<Student>> => {
  try {
    const response = await api.put<ApiResponse<Student>>(`/api/parent/students/${studentId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 300000, // 5 minutes timeout for file uploads
    });
    return response.data;
  } catch (error) {
    console.error('Error updating student:', error);
    if (error instanceof AxiosError) {
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
};

// Description: Get student by ID
// Endpoint: GET /api/parent/students/:studentId
// Request: {}
// Response: { success: boolean, student: Student }
export const getStudentById = async (studentId: string) => {
  try {
    const response = await api.get(`/api/parent/students/${studentId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Parse student file for preview before upload
// Endpoint: POST /api/parent/parse-student-file
// Request: FormData with 'file' field containing Excel/CSV file
// Response: { success: boolean, message: string, data: { validRows: Array, errors: Array, totalRows: number } }
export const parseStudentFile = async (formData: FormData) => {
  try {
    const response = await api.post('/api/parent/parse-student-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 300000, // 5 minutes timeout for large files
    });
    return response.data;
  } catch (error: any) {
    console.error('Error parsing student file:', error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Bulk upload students from Excel/CSV file
// Endpoint: POST /api/parent/bulk-upload-students
// Request: FormData with 'file' field containing Excel/CSV file
// Response: { success: boolean, message: string, results: { successCount: number, errors: Array<{ row: number, error: string }> } }
export const bulkUploadStudents = async (formData: FormData) => {
  try {
    const response = await api.post('/api/parent/bulk-upload-students', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 300000, // 5 minutes timeout for large files
    });
    return response.data;
  } catch (error: any) {
    console.error('Error bulk uploading students:', error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

export const deleteBulkStudents = async (studentIds: string[]) => {
  try {
    const response = await api.delete('/api/parent/bulk-delete-students', {
      data: { studentIds },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting students:', error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get all sports for dropdown options
// Endpoint: GET /api/parent/sports-options
// Response: { success: boolean, sports: Sport[] }
export const getSportsOptions = async () => {
  try {
    const response = await api.get('/api/parent/sports-options');
    return response.data;
  } catch (error) {
    console.error('Error fetching sports options:', error);
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error('An unknown error occurred');
  }
};

// Description: Get all distances for dropdown options
// Endpoint: GET /api/parent/distances-options
// Response: { success: boolean, distances: Distance[] }
export const getDistancesOptions = async () => {
  try {
    const response = await api.get('/api/parent/distances-options');
    return response.data;
  } catch (error) {
    console.error('Error fetching distances options:', error);
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error('An unknown error occurred');
  }
};

// Description: Get sport sub types for a specific sport
// Endpoint: GET /api/parent/sport-subtypes-options/:sportId
// Response: { success: boolean, sportSubTypes: SportSubType[] }
export const getSportSubTypesOptions = async (sportId: string) => {
  try {
    const response = await api.get(`/api/parent/sport-subtypes-options/${sportId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sport subtypes options:', error);
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error('An unknown error occurred');
  }
};

// Description: Get all age categories for dropdown options
// Endpoint: GET /api/parent/age-categories-options
// Response: { success: boolean, ageCategories: AgeCategory[] }
export const getAgeCategoriesOptions = async () => {
  try {
    const response = await api.get('/api/parent/age-categories-options');
    return response.data;
  } catch (error) {
    console.error('Error fetching age categories options:', error);
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error('An unknown error occurred');
  }
};

