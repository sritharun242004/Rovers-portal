import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  checkLocationSupport, 
  getLocationWithDetails, 
  validateCoordinates,
  logLocationInfo,
  logLocationError,
  type LocationInfo,
  type LocationError 
} from '@/utils/locationUtils';

interface LocationDebuggerProps {
  onLocationCaptured?: (location: LocationInfo) => void;
  onLocationError?: (error: LocationError) => void;
}

export function LocationDebugger({ onLocationCaptured, onLocationError }: LocationDebuggerProps) {
  const [locationSupport, setLocationSupport] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<LocationInfo | null>(null);
  const [locationError, setLocationError] = useState<LocationError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [locationHistory, setLocationHistory] = useState<Array<LocationInfo | LocationError>>([]);

  useEffect(() => {
    const support = checkLocationSupport();
    setLocationSupport(support);
  }, []);

  const testLocation = async () => {
    setIsLoading(true);
    setLocationError(null);
    setCurrentLocation(null);

    try {
      const result = await getLocationWithDetails();
      
      if (result.success && result.location) {
        setCurrentLocation(result.location);
        setLocationHistory(prev => [...prev, result.location!]);
        logLocationInfo(result.location, 'Location Debugger');
        onLocationCaptured?.(result.location);
      } else if (result.error) {
        setLocationError(result.error);
        setLocationHistory(prev => [...prev, result.error!]);
        logLocationError(result.error, 'Location Debugger');
        onLocationError?.(result.error);
      }
    } catch (error) {
      const errorObj: LocationError = {
        code: -3,
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      };
      setLocationError(errorObj);
      setLocationHistory(prev => [...prev, errorObj]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'granted': return 'bg-green-500';
      case 'denied': return 'bg-red-500';
      case 'prompt': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Location Debugger
            <Badge variant={locationSupport?.supported ? "default" : "destructive"}>
              {locationSupport?.supported ? "Supported" : "Not Supported"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Location Support Status */}
          {locationSupport && (
            <div className="space-y-2">
              <h4 className="font-medium">Browser Support</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Supported: {locationSupport.supported ? 'Yes' : 'No'}</div>
                <div>Permission: 
                  <Badge className={`ml-1 ${getStatusColor(locationSupport.permission)}`}>
                    {locationSupport.permission}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-gray-600">{locationSupport.message}</p>
            </div>
          )}

          {/* Test Location Button */}
          <Button 
            onClick={testLocation} 
            disabled={isLoading || !locationSupport?.supported}
            className="w-full"
          >
            {isLoading ? 'Getting Location...' : 'Test Location Capture'}
          </Button>

          {/* Current Location Display */}
          {currentLocation && (
            <div className="space-y-2">
              <h4 className="font-medium">Current Location</h4>
              <div className="bg-green-50 p-3 rounded-lg space-y-1 text-sm">
                <div><strong>Coordinates:</strong> {currentLocation.latitude}, {currentLocation.longitude}</div>
                <div><strong>Accuracy:</strong> {currentLocation.accuracy ? `${currentLocation.accuracy}m` : 'Unknown'}</div>
                <div><strong>Timestamp:</strong> {new Date(currentLocation.timestamp).toLocaleString()}</div>
                <div><strong>Source:</strong> {currentLocation.source}</div>
              </div>
            </div>
          )}

          {/* Location Error Display */}
          {locationError && (
            <div className="space-y-2">
              <h4 className="font-medium">Location Error</h4>
              <div className="bg-red-50 p-3 rounded-lg space-y-1 text-sm">
                <div><strong>Code:</strong> {locationError.code}</div>
                <div><strong>Message:</strong> {locationError.message}</div>
                <div><strong>Timestamp:</strong> {new Date(locationError.timestamp).toLocaleString()}</div>
              </div>
            </div>
          )}

          {/* Location History */}
          {locationHistory.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Location History</h4>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {locationHistory.slice(-5).reverse().map((item, index) => (
                  <div key={index} className={`p-2 rounded text-xs ${
                    'latitude' in item ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                    {new Date(item.timestamp).toLocaleTimeString()} - 
                    {'latitude' in item 
                      ? `Location: ${item.latitude}, ${item.longitude}`
                      : `Error: ${item.message}`
                    }
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 