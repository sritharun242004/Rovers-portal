import api from './api';
import { io } from 'socket.io-client';
const VITE_API_URL = import.meta.env.VITE_API_URL;

const socket = io(VITE_API_URL || 'http://localhost:3000');

// Description: Verify student attendance
// Endpoint: POST /api/attendance/verify
// Request: { studentId: string, checkpoint: string, location: { latitude: number, longitude: number } }
// Response: { success: boolean, student: { name: string, id: string } }
export const verifyAttendance = async (data: {
  studentId: string,
  checkpoint: string,
  location?: { latitude: number, longitude: number }
}) => {
  try {
    // Get current location with improved error handling
    const location = await getCurrentLocation()

    const response = await api.post('/api/attendance/verify', {
      ...data,
      location
    });
    return response.data;
    
  } catch (error) {
    // Enhanced error handling to capture and propagate specific error messages
    const errorMessage = error?.response?.data?.message ||
                         error?.message ||
                         'Unknown error occurred during verification';
    console.error("Attendance verification error:", errorMessage);
    throw new Error(errorMessage);
  }
};

// Helper function to get current location with retry logic and better error handling
// Description: Get current geolocation with retry mechanism
// Returns: Promise<{ latitude: number, longitude: number }>
const getCurrentLocation = (retryCount = 0): Promise<{ latitude: number, longitude: number }> => {
  const maxRetries = 2;
  
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser. Please use a modern browser with location services.'));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000, // Increased timeout to 10 seconds
      maximumAge: 30000 // Accept cached position up to 30 seconds old
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Validate the coordinates
        if (position.coords.latitude === 0 && position.coords.longitude === 0) {
          if (retryCount < maxRetries) {
            console.warn(`Invalid coordinates received (0,0), retrying... (${retryCount + 1}/${maxRetries})`);
            setTimeout(() => {
              getCurrentLocation(retryCount + 1).then(resolve).catch(reject);
            }, 1000);
            return;
          } else {
            reject(new Error('Unable to get valid location coordinates after multiple attempts. Please check your device location settings.'));
            return;
          }
        }

        // Check for reasonable coordinate values
        if (Math.abs(position.coords.latitude) > 90 || Math.abs(position.coords.longitude) > 180) {
          reject(new Error('Invalid location coordinates received. Please try again.'));
          return;
        }

        console.log('Location captured successfully:', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });

        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.warn("Geolocation error:", error);
        
        let errorMessage = 'Location capture failed. ';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Location permission denied. Please enable location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information unavailable. Please check your device location services.';
            break;
          case error.TIMEOUT:
            if (retryCount < maxRetries) {
              console.warn(`Location timeout, retrying... (${retryCount + 1}/${maxRetries})`);
              setTimeout(() => {
                getCurrentLocation(retryCount + 1).then(resolve).catch(reject);
              }, 1000);
              return;
            } else {
              errorMessage += 'Location request timed out. Please try again.';
            }
            break;
          default:
            errorMessage += 'An unknown error occurred while getting location.';
        }
        
        reject(new Error(errorMessage));
      },
      options
    );
  });
};

// Description: Get attendance statistics
// Endpoint: GET /api/statistics/stats
// Request: {}
// Response: { totalRegistered: number, entranceCount: number, sportsCount: number, exitCount: number, sportBreakdown: { entrance: Array<{ sport: string, count: number }>, sports: Array<{ sport: string, count: number }>, exit: Array<{ sport: string, count: number }> } }
export const getAttendanceStats = async () => {
  try {
    const response = await api.get('/api/statistics/stats');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

export const subscribeToStatistics = (callback: (stats: any) => void) => {
  socket.on('statistics-update', callback);
  return () => {
    socket.off('statistics-update', callback);
  };
};