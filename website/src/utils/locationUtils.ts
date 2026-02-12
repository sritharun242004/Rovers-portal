// Location utility functions for debugging and monitoring

export interface LocationInfo {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
  source: 'gps' | 'network' | 'unknown';
}

export interface LocationError {
  code: number;
  message: string;
  timestamp: number;
}

// Check if geolocation is supported and available
export const checkLocationSupport = (): {
  supported: boolean;
  permission: 'granted' | 'denied' | 'prompt' | 'unknown';
  message: string;
} => {
  if (!navigator.geolocation) {
    return {
      supported: false,
      permission: 'unknown',
      message: 'Geolocation is not supported by this browser'
    };
  }

  // Check if we're on HTTPS (required for geolocation in modern browsers)
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    return {
      supported: true,
      permission: 'unknown',
      message: 'HTTPS is required for geolocation. Please use HTTPS or localhost.'
    };
  }

  // Try to get permission status (if supported)
  if ('permissions' in navigator) {
    navigator.permissions.query({ name: 'geolocation' as PermissionName })
      .then(permissionStatus => {
        return {
          supported: true,
          permission: permissionStatus.state as 'granted' | 'denied' | 'prompt',
          message: `Permission status: ${permissionStatus.state}`
        };
      })
      .catch(() => {
        return {
          supported: true,
          permission: 'unknown',
          message: 'Could not determine permission status'
        };
      });
  }

  return {
    supported: true,
    permission: 'unknown',
    message: 'Geolocation is supported'
  };
};

// Validate coordinates
export const validateCoordinates = (latitude: number, longitude: number): {
  valid: boolean;
  issues: string[];
} => {
  const issues: string[] = [];

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    issues.push('Coordinates must be numbers');
  }

  if (latitude === 0 && longitude === 0) {
    issues.push('Coordinates are zero (0,0) - likely a geolocation failure');
  }

  if (Math.abs(latitude) > 90) {
    issues.push(`Latitude ${latitude} is outside valid range (-90 to 90)`);
  }

  if (Math.abs(longitude) > 180) {
    issues.push(`Longitude ${longitude} is outside valid range (-180 to 180)`);
  }

  return {
    valid: issues.length === 0,
    issues
  };
};

// Get location with detailed error reporting
export const getLocationWithDetails = (options?: PositionOptions): Promise<{
  success: boolean;
  location?: LocationInfo;
  error?: LocationError;
}> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        success: false,
        error: {
          code: -1,
          message: 'Geolocation not supported',
          timestamp: Date.now()
        }
      });
      return;
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: LocationInfo = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
          source: 'gps' // This is a simplification - in reality it could be network-based
        };

        const validation = validateCoordinates(location.latitude, location.longitude);
        
        if (!validation.valid) {
          resolve({
            success: false,
            location,
            error: {
              code: -2,
              message: `Invalid coordinates: ${validation.issues.join(', ')}`,
              timestamp: Date.now()
            }
          });
          return;
        }

        resolve({
          success: true,
          location
        });
      },
      (error) => {
        const locationError: LocationError = {
          code: error.code,
          message: getLocationErrorMessage(error),
          timestamp: Date.now()
        };

        resolve({
          success: false,
          error: locationError
        });
      },
      { ...defaultOptions, ...options }
    );
  });
};

// Get human-readable error message
export const getLocationErrorMessage = (error: GeolocationPositionError): string => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Location permission denied. Please enable location access in your browser settings.';
    case error.POSITION_UNAVAILABLE:
      return 'Location information unavailable. Please check your device location services.';
    case error.TIMEOUT:
      return 'Location request timed out. Please try again.';
    default:
      return 'An unknown error occurred while getting location.';
  }
};

// Log location information for debugging
export const logLocationInfo = (location: LocationInfo, context: string = 'Location capture') => {
  console.log(`${context}:`, {
    coordinates: `${location.latitude}, ${location.longitude}`,
    accuracy: location.accuracy ? `${location.accuracy}m` : 'unknown',
    timestamp: new Date(location.timestamp).toISOString(),
    source: location.source
  });
};

// Log location error for debugging
export const logLocationError = (error: LocationError, context: string = 'Location error') => {
  console.warn(`${context}:`, {
    code: error.code,
    message: error.message,
    timestamp: new Date(error.timestamp).toISOString()
  });
}; 