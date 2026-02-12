import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from '@/hooks/useToast';
import { Loader2, AlertCircle, CheckCircle2, Upload, Building2, User, Search } from 'lucide-react';
import {
  getSportSubTypes,
  getSportDistances,
  getSportAgeCategories,
  getSportDetails
} from '@/api/sports';
import { getEligibleStudents, verifySchoolCode } from '@/api/registration';
import { registerStudentWithPaymentScreenshot, registerGroupWithPaymentScreenshot } from '@/api/directRegistration';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Define interfaces for the data structures
interface Sport {
  _id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  address?: string;
}

interface Student {
  _id: string;
  name: string;
  age: number;
  photo?: string;
  uid?: string;
  dob?: string;
  gender?: string;
  isEligible: boolean;
  isRegistered?: boolean;
}

interface AgeCategory {
  _id: string;
  ageGroup: string;
  isEligible?: boolean;
}

interface SportSubType {
  _id: string;
  name?: string;
  type?: string;
}

interface Distance {
  _id: string;
  category?: string;
  value?: string;
  unit?: string;
}

interface SchoolData {
  _id: string;
  name: string;
  email: string;
  address: string;
  contactPersonName: string;
  schoolType?: string;
}

// Add pricing map at the top of the file
const sportPricingMap: Record<string, number> = {
  'Running': 0,
  'Swimming': 0,
  'Taekwondo': 0,
  'Karate': 0,
  'Padel Tennis': 0,
  'Skating': 0,
  'Badminton': 0,
  'Football': 0,
  'Cricket': 0
};

interface SportRegistrationFormProps {
  sport?: Sport;
  sportId?: string;
  sportName?: string;
  eventId?: string;
  onRegistrationComplete?: () => void;
  onSuccess?: (registration: any) => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

export function SportRegistrationForm({ 
  sport: propSport, 
  sportId, 
  sportName, 
  eventId, 
  onRegistrationComplete, 
  onSuccess, 
  onOpenChange, 
  open 
}: SportRegistrationFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [sportData, setSportData] = useState<Sport | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [ageCategories, setAgeCategories] = useState<AgeCategory[]>([]);
  const [selectedAgeCategory, setSelectedAgeCategory] = useState('');
  const [sportSubTypes, setSportSubTypes] = useState<SportSubType[]>([]);
  const [selectedSportSubType, setSelectedSportSubType] = useState('');
  const [distances, setDistances] = useState<Distance[]>([]);
  const [selectedDistance, setSelectedDistance] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentFile, setPaymentFile] = useState<File | null>(null);

  // Student selection states
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isGroupSport, setIsGroupSport] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(false);
  
  // School registration states
  const [registrationType, setRegistrationType] = useState('self');
  const [schoolCode, setSchoolCode] = useState('');
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null);
  const [verifyingSchool, setVerifyingSchool] = useState(false);
  const [schoolCodeVerified, setSchoolCodeVerified] = useState(false);

  // If propSport is provided, use it directly
  useEffect(() => {
    if (propSport && propSport._id) {
      setSportData(propSport);
      setDataLoading(false);
    }
  }, [propSport]);

  // Determine if it's a group sport based on sport name
  useEffect(() => {
    if (sportData?.name) {
      const groupSport = ['Cricket', 'Football'].includes(sportData.name);
      setIsGroupSport(groupSport);
    }
  }, [sportData]);

  // Fetch sport data if not provided as prop
  useEffect(() => {
    const fetchSportData = async () => {
      if (propSport && propSport._id) {
        return; // Already set from props
      }

      if (!sportId) {
        setDataLoading(false);
        return;
      }

      try {
        const sportDetailsResponse = await getSportDetails(sportId);

        if (!sportDetailsResponse.sport) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load sport details"
          });
          return;
        }
        setSportData(sportDetailsResponse.sport);
      } catch (error: unknown) {
        console.error('Error fetching sport details:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load sport details"
        });
      } finally {
        setDataLoading(false);
      }
    };

    if (open) {
      fetchSportData();
    }
  }, [open, sportId, propSport, toast]);

  // Fetch age categories
  useEffect(() => {
    const fetchAgeCategories = async () => {
      if (!sportData?._id) return;

      try {
        setDataLoading(true);
        const response = await getSportAgeCategories(sportData._id);

        setAgeCategories(response.ageCategories || []);
      } catch (error: unknown) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load age categories"
        });
      } finally {
        setDataLoading(false);
      }
    };

    fetchAgeCategories();
  }, [sportData, toast]);

  // Fetch sport sub-types
  useEffect(() => {
    const fetchSportSubTypes = async () => {
      if (!sportData?._id) return;

      try {

        setDataLoading(true);
        const response = await getSportSubTypes(sportData._id);
;
        setSportSubTypes(response.subtypes || []);
      } catch (error) {

        // Don't show error toast, as subtypes are optional
      } finally {
        setDataLoading(false);
      }
    };

    fetchSportSubTypes();
  }, [sportData]);

  // Fetch distances
  useEffect(() => {
    const fetchDistances = async () => {
      if (!sportData?._id) {

        return;
      }

      try {

        setDataLoading(true);
        const response = await getSportDistances(sportData._id);


        if (!response.distances) {
          console.warn('No distances property in response:', response);
          toast({
            variant: "destructive",
            title: "Warning",
            description: "Failed to load distances data"
          });
        }

        // Ensure we always have an array, even if empty
        const distancesArray = response.distances || [];

        setDistances(distancesArray);
      } catch (error) {
        console.error('Error fetching distances:', error);
        toast({
          variant: "destructive",
          title: "Warning",
          description: "Failed to load distances"
        });
      } finally {
        setDataLoading(false);
      }
    };

    fetchDistances();
  }, [sportData, toast]);

  // When age category changes, fetch eligible students
  const handleAgeCategorySelect = async (categoryId: string) => {
    try {
      setSelectedAgeCategory(categoryId);
      setSelectedStudents([]); // Clear previous selections

      if (!sportData?._id) {
        console.error('Sport data is missing');
        return;
      }

      setStudentsLoading(true);
      const response = await getEligibleStudents(sportData._id, categoryId);

      setStudents(response.students || []);
      setIsGroupSport(response.isGroupSport || false);

      setStudentsLoading(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load eligible students"
      });
      setStudentsLoading(false);
    }
  };

  const handleSportSubTypeSelect = (subTypeId: string) => {
    setSelectedSportSubType(subTypeId);
  };

  const handleDistanceSelect = (distanceId: string) => {
    setSelectedDistance(distanceId);
  };

  const handleStudentSelect = (studentId: string) => {
    if (isGroupSport) {
      // For group sports, toggle student selection in the array
      if (selectedStudents.includes(studentId)) {
        setSelectedStudents(selectedStudents.filter(id => id !== studentId));
      } else {
        // Check if the limit of 9 students is reached
        if (selectedStudents.length < 9) {
          setSelectedStudents([...selectedStudents, studentId]);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "You can select a maximum of 9 students for group sports."
          });
        }
      }
    } else {
      // For individual sports, only allow selecting one student
      setSelectedStudents([studentId]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPaymentFile(file);
    }
  };

  const handleTransactionIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTransactionId(e.target.value);
  };
  
  const handleRegistrationTypeChange = (value: string) => {
    setRegistrationType(value);
    // Reset school data if switching to self-registration
    if (value === 'self') {
      setSchoolCode('');
      setSchoolData(null);
      setSchoolCodeVerified(false);
    }
  };
  
  const handleSchoolCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSchoolCode(e.target.value);
    setSchoolCodeVerified(false);
    setSchoolData(null);
  };
  
  const handleVerifySchoolCode = async () => {
    if (!schoolCode.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a school code"
      });
      return;
    }
    
    try {
      setVerifyingSchool(true);
      const response = await verifySchoolCode(schoolCode.trim());
      
      if (response.success) {
        setSchoolData(response.school);
        setSchoolCodeVerified(true);
        toast({
          title: "Success",
          description: "School verified successfully"
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to verify school code"
      });
      setSchoolCodeVerified(false);
      setSchoolData(null);
    } finally {
      setVerifyingSchool(false);
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);

      // Validation checks
      if (selectedStudents.length === 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: isGroupSport
            ? "Please select students for registration"
            : "Please select a student for registration"
        });
        setLoading(false);
        return;
      }

      if (isGroupSport && selectedStudents.length < 7) {
        toast({
          variant: "destructive",
          title: "Error",
          description: sportData ? `${sportData.name} requires at least 7 students` : "This sport requires at least 7 students"
        });
        setLoading(false);
        return;
      }

      if (!selectedAgeCategory) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select an age category"
        });
        setLoading(false);
        return;
      }
      
      // Check if school registration is selected but not verified
      if (registrationType === 'school' && !schoolCodeVerified) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please verify the school code first"
        });
        setLoading(false);
        return;
      }

      if (!paymentFile) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please upload a payment screenshot"
        });
        setLoading(false);
        return;
      }

      if (!sportData || !sportData._id) {
        console.error('Invalid sport data:', sportData);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Sport information is missing. Please try again."
        });
        setLoading(false);
        return;
      }

      // Create form data for file upload
      const formData = new FormData();
      formData.append('sportId', sportData._id);
      if (eventId) formData.append('eventId', eventId);
      formData.append('ageCategoryId', selectedAgeCategory);
      formData.append('isGroupSport', isGroupSport.toString());

      // Add optional fields if they're selected
      if (selectedDistance) formData.append('distanceId', selectedDistance);
      if (selectedSportSubType) formData.append('sportSubTypeId', selectedSportSubType);
      if (transactionId) formData.append('transactionId', transactionId);
      
      // Add school ID if registering under a school
      if (registrationType === 'school' && schoolData) {
        formData.append('schoolId', schoolData._id);
      }

      // Add payment screenshot
      formData.append('paymentScreenshot', paymentFile);

      // Log FormData contents for debugging


      // Add student information based on sport type
      if (isGroupSport) {
        // For group sports
        selectedStudents.forEach(studentId => {
          formData.append('studentIds', studentId);
        });


        const response = await registerGroupWithPaymentScreenshot(formData);

        if (response.success) {
          toast({
            title: "Success",
            description: `Group of ${selectedStudents.length} students registered successfully!`
          });

          if (typeof onOpenChange === 'function') {
            onOpenChange(false);
          }

          if (typeof onRegistrationComplete === 'function') {
            onRegistrationComplete();
          }

          if (typeof onSuccess === 'function') {
            onSuccess(response.registration);
          }
        }
      } else {
        // For individual sports
        formData.append('studentId', selectedStudents[0]);

        const response = await registerStudentWithPaymentScreenshot(formData);

        if (response.success) {
          toast({
            title: "Success",
            description: "Student registered successfully!"
          });

          if (typeof onOpenChange === 'function') {
            onOpenChange(false);
          }

          if (typeof onRegistrationComplete === 'function') {
            onRegistrationComplete();
          }

          if (typeof onSuccess === 'function') {
            onSuccess(response.registration);
          }
        }
      }

      setLoading(false);
    } catch (error: unknown) {
      console.error('Error in registration process:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to complete registration"
      });
      setLoading(false);
    }
  };

  // If data is still loading or sport data is missing, show loading state
  if (!sportData && dataLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If sport data is missing after loading, show error
  if (!sportData && !dataLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <p className="text-red-500">Error: Sport information is missing.</p>
        <Button onClick={onRegistrationComplete} className="mt-4">Close</Button>
      </div>
    );
  }

  // If sportName is not available, use the name from the sport object
  const displaySportName = sportName || (sportData?.name) || "Sport";

  // Get the price for the current sport
  const sportPrice = sportData?.name ? sportPricingMap[sportData.name] || 0 : 0;

  // Calculate total price based on the sport type
  // For team sports (Cricket and Football), use flat fee regardless of number of students
  const totalPrice = isGroupSport ? sportPrice : (selectedStudents.length > 0 ? sportPrice * selectedStudents.length : sportPrice);

  // Determine if we should show "Pre Registration Fee" label for Badminton
  const isBadminton = sportData?.name === 'Badminton';
  const feeLabel = isBadminton ? "Pre Registration Fee" : "Registration Fee";

  return (
    <div className="space-y-4 max-h-[80vh] overflow-y-auto px-1 pb-6">
      <h3 className="text-lg font-medium">Register for {displaySportName}</h3>

      <div className="space-y-2">
        <Label htmlFor="ageCategory">Age Category</Label>
        <Select onValueChange={handleAgeCategorySelect} disabled={loading || dataLoading}>
          <SelectTrigger id="ageCategory">
            <SelectValue placeholder="Select age category" />
          </SelectTrigger>
          <SelectContent>
            {ageCategories.map((category) => (
              <SelectItem key={category._id} value={category._id}>
                {category.ageGroup}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedAgeCategory && (
        <div className="space-y-2">
          <Label>{isGroupSport ? 'Select Students (maximum 9 allowed)' : 'Select Student'}</Label>
          {studentsLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : students.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto border rounded p-2">
              {students.map((student) => (
                <div key={student._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`student-${student._id}`}
                    checked={selectedStudents.includes(student._id)}
                    onCheckedChange={() => handleStudentSelect(student._id)}
                    disabled={
                      !student.isEligible ||
                      student.isRegistered ||
                      (!isGroupSport && selectedStudents.length > 0 && !selectedStudents.includes(student._id)) ||
                      (isGroupSport && selectedStudents.length >= 9 && !selectedStudents.includes(student._id)) // Disable if limit reached
                    }
                  />
                  <label
                    htmlFor={`student-${student._id}`}
                    className={`text-sm flex-1 ${!student.isEligible || student.isRegistered ? 'text-muted-foreground line-through' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{student.name} ({student.age} years)</span>
                      {student.isRegistered && (
                        <AlertCircle 
                          className="h-4 w-4 text-amber-500" 
                          aria-label="Already registered" 
                        />
                      )}
                      {!student.isEligible && !student.isRegistered && (
                        <AlertCircle 
                          className="h-4 w-4 text-red-500" 
                          aria-label="Not eligible for this age category" 
                        />
                      )}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground py-2">
              No eligible students found for this age category.
            </div>
          )}
          {isGroupSport && (
            <div className="text-sm text-muted-foreground flex items-center">
              <span className={selectedStudents.length >= 9 ? 'text-red-600' : 'text-green-600'}>
                {selectedStudents.length} of 9 maximum students selected
              </span>
              {selectedStudents.length >= 9 && (
                <AlertCircle 
                  className="ml-1 h-4 w-4 text-red-600" 
                  aria-label="Maximum limit reached" 
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* Registration Type Selection (for parents only) */}
      {selectedStudents.length > 0 && !isGroupSport && (
        <div className="space-y-3 pt-2 border-t">
          <Label>Registration Type</Label>
          <RadioGroup value={registrationType} onValueChange={handleRegistrationTypeChange} className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="self" id="self" />
              <Label htmlFor="self" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Self Registration
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="school" id="school" />
              <Label htmlFor="school" className="flex items-center">
                <Building2 className="h-4 w-4 mr-2" />
                Registration under School
              </Label>
            </div>
          </RadioGroup>
          
          {/* School Code Input */}
          {registrationType === 'school' && (
            <div className="space-y-3 mt-3 p-3 bg-muted/50 rounded-md">
              <Label htmlFor="schoolCode">School Unique Code</Label>
              <div className="flex space-x-2">
                <Input
                  id="schoolCode"
                  value={schoolCode}
                  onChange={handleSchoolCodeChange}
                  placeholder="Enter school code"
                  disabled={verifyingSchool || loading}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  size="sm" 
                  onClick={handleVerifySchoolCode}
                  disabled={verifyingSchool || !schoolCode.trim() || loading}
                >
                  {verifyingSchool ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Verify
                </Button>
              </div>
              
              {/* School Information Display */}
              {schoolCodeVerified && schoolData && (
                <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{schoolData.name}</h4>
                      <p className="text-xs text-muted-foreground">{schoolData.address}</p>
                      <p className="text-xs text-muted-foreground">Contact: {schoolData.contactPersonName}</p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {sportSubTypes.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="sportSubType">Sport Sub-Type</Label>
          <Select onValueChange={handleSportSubTypeSelect} disabled={loading || dataLoading}>
            <SelectTrigger id="sportSubType">
              <SelectValue placeholder="Select sub-type" />
            </SelectTrigger>
            <SelectContent>
              {sportSubTypes.map((subType) => {
                // Use multiple properties in a fallback chain for maximum compatibility
                const displayText = subType.name || subType.type || 'Unknown sub-type';

                return (
                  <SelectItem key={subType._id} value={subType._id}>
                    {displayText}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      )}
      {distances.length > 0 ? (
        <div className="space-y-2">
          <Label htmlFor="distance">Distance ({distances.length} available)</Label>
          <Select onValueChange={handleDistanceSelect} disabled={loading || dataLoading}>
            <SelectTrigger id="distance">
              <SelectValue placeholder="Select distance" />
            </SelectTrigger>
            <SelectContent>
              {distances.map((distance) => {
                // Use category if available, otherwise construct from value and unit
                const displayText = distance.category ||
                  (distance.value && distance.unit ?
                    `${distance.value} ${distance.unit}` :
                    'Unknown distance');
                return (
                  <SelectItem key={distance._id} value={distance._id}>
                    {displayText}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          No distances available for this sport
        </div>
      )}
      {selectedAgeCategory && selectedStudents.length > 0 && (
        <Card className="bg-muted/50 mt-4">
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">Account Details</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Account No:</span> 13312306820001</p>
              <p><span className="font-medium">Account Name:</span> TOPTEKKER SPORTS SERVICES CO LLC</p>
              <p><span className="font-medium">Bank:</span> Abu Dhabi Commercial Bank</p>
              <p><span className="font-medium">Branch Code / Branch Name:</span> 752 / IBD-AL Karamah Branch</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Please transfer the registration fee to the account above and upload the payment screenshot below.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Payment Information Section */}
      <div className="space-y-4 pt-2 border-t">
        <h3 className="font-medium">Payment Information</h3>

        <div className="space-y-2">
          <Label htmlFor="paymentScreenshot">Payment Screenshot *</Label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Input
              id="paymentScreenshot"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="flex-1 text-sm"
              required
              disabled={loading}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              <Upload className="h-4 w-4 mr-2" /> Upload
            </Button>
          </div>
          {paymentFile && (
            <p className="text-xs text-muted-foreground break-all">
              Selected file: {paymentFile.name} ({Math.round(paymentFile.size / 1024)} KB)
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="transactionId">Transaction ID (Optional)</Label>
          <Input
            id="transactionId"
            type="text"
            placeholder="Enter transaction ID if available"
            value={transactionId}
            onChange={handleTransactionIdChange}
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 sticky bottom-0 pt-4 bg-background">
        <p className="text-sm text-muted-foreground">
          {feeLabel}: {totalPrice} RS
        </p>
        <Button
          onClick={handleRegister}
          disabled={
            loading ||
            dataLoading ||
            !selectedAgeCategory ||
            selectedStudents.length === 0 ||
            (isGroupSport && selectedStudents.length < 7) ||
            !paymentFile
          }
          className="w-full"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {loading ? "Processing..." : "Register"}
        </Button>
      </div>
    </div>
  );
}