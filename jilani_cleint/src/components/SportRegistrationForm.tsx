import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/hooks/useToast';
import { getSportDetails, getSportAgeCategories, getSportDistances, getSportSubTypes } from '@/api/sports';
import { getEligibleStudents, registerStudentsForSport, verifySchoolCode } from '@/api/registration';
import { PaymentDetailsForm } from './PaymentDetailsForm';
import { RegistrationConfirmationDialog } from "./RegistrationConfirmationDialog";
import { useAuth } from '@/contexts/AuthContext';
import { Info, Loader2, PlusCircle, Building2, User, Search, CheckCircle2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

// Add type for age distance maps
interface AgeDistanceMap {
  [key: string]: string[];
}

// Add type for running and swimming distance maps
const runningAgeDistanceMap: AgeDistanceMap = {
  'Under 7': ['60m'],
  'Under 9': ['80m'],
  'Under 11': ['80m'],
  'Under 13': ['100m'],
  'Under 15': ['100m'],
  'Under 17': ['100m']
};

// Swimming distance mapping
const swimmingAgeDistanceMap: AgeDistanceMap = {
  'Under 7': ['25m'],
  'Under 9': ['25m'],
  'Under 11': ['25m'],
  'Under 12': ['25m'],
  'Under 15': ['50m'],
  'Under 17': ['50m']
};

// Add pricing map with type
interface SportPriceMap {
  [key: string]: number;
}

const sportPricingMap: SportPriceMap = {
  'Running': 0,
  'Swimming': 0,
  'Taekwondo': 0,
  'Karate': 0,
  'Padel Tennis': 0,
  'Skating': 0,
  'Badminton': 0,
  'Football': 0,
  'Cricket' : 0
};

// Add these TypeScript interfaces at the top of the file, after imports
interface Sport {
  _id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  description?: string;
  address?: string;
  mapsPin?: string;
  image?: string;
}

interface Student {
  _id: string;
  name: string;
  age?: number;
  isEligible: boolean;
  isRegistered?: boolean;
  uid?: string;
  sport?: string;
  location?: string;
  status?: string;
  photo?: string;
  dob?: string | null;
  gender?: string;
  nationality?: string;
  city?: string;
  represents?: string;
  class?: string;
  bloodGroup?: string;
  relationship?: string;
  registrationCount?: number;
}

interface AgeCategory {
  _id: string;
  ageGroup: string;
}

interface Distance {
  _id: string;
  category?: string;
  name?: string;
  value?: number;
  unit?: string;
}

interface SportSubType {
  _id: string;
  name?: string;
  type?: string;
}

interface SchoolData {
  _id: string;
  name: string;
  address: string;
  contactPersonName: string;
}

interface FormData {
  studentId?: string;
  studentIds: string[];
  sportId: string;
  eventId: string;
  ageCategoryId: string;
  distanceId?: string;
  sportSubTypeId?: string;
  isGroupSport: boolean;
  substitutes: string[];
  schoolId?: string;
}

interface SportRegistrationFormProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  sportId?: string;
  sportName?: string;
  sport?: Sport;
  eventId?: string;
  onSuccess?: (registration: any) => void;
  onClose?: () => void;
}

export function SportRegistrationForm({
  open,
  onOpenChange,
  sportId,
  sportName,
  sport: propSport,
  eventId,
  onSuccess,
  onClose
}: SportRegistrationFormProps) {
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<{
    ageCategory: string;
    distance?: string;
    sportSubType?: string;
    studentIds: string[];
  }>();
  const { userRole } = useAuth();
  const [eligibleStudents, setEligibleStudents] = useState<Student[]>([]);
  const [ageCategories, setAgeCategories] = useState<AgeCategory[]>([]);
  const [distances, setDistances] = useState<Distance[]>([]);
  const [sportSubTypes, setSportSubTypes] = useState<SportSubType[]>([]);
  const [loading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedAgeCategory, setSelectedAgeCategory] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [substitutes, setSubstitutes] = useState<Student[]>([]); // Updated type
  const [isGroupSport, setIsGroupSport] = useState(false);
  const [minStudentsRequired, setMinStudentsRequired] = useState(1);
  const [sport, setSport] = useState<Sport | null>(null);
  const [step, setStep] = useState(1); // 1 for student selection, 2 for payment details
  const [formData, setFormData] = useState<FormData | null>(null);
  const { toast } = useToast();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [registeredStudentCount, setRegisteredStudentCount] = useState(0);
  const navigate = useNavigate();

  // Add this state for filtered distances
  const [filteredDistances, setFilteredDistances] = useState<Distance[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // School registration states
  const [registrationType, setRegistrationType] = useState('self');
  const [schoolCode, setSchoolCode] = useState('');
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null);
  const [verifyingSchool, setVerifyingSchool] = useState(false);
  const [schoolCodeVerified, setSchoolCodeVerified] = useState(false);

  // Add this constant to check if user is a school
  const isSchool = userRole === 'school';
  const isParent = userRole === 'parent';

  // If propSport is provided, use it directly
  useEffect(() => {
    if (propSport && propSport._id) {
      setSport(propSport);

      // Check if it's a group sport (for example, Cricket or Football)
      const groupSportNames = ['Cricket', 'Football'];
      const isGroup = groupSportNames.includes(propSport.name)
      setMinStudentsRequired(isGroup ? 7 : 1);
      setIsGroupSport(isGroup);
      // Use regular string concatenation instead of template literals to avoid any hidden character issue
    }
  }, [propSport]);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      reset();
      setStep(1); // Reset to first step when dialog opens
      setSelectedStudents([]);
      setSubstitutes([]); // Reset substitutes
      setSelectedAgeCategory('');
    }
  }, [open, reset]);

  // Fetch sport details when a sport is selected
  useEffect(() => {
    const fetchSportDetails = async () => {
      if (!sportId) {
        return;
      }

      try {
        // Fetch each separately for better error tracking
        try {
          const distanceResponse = await getSportDistances(sportId);
          setDistances(distanceResponse?.distances || []);
        } catch (error) {
          console.error("Error fetching sport distances:", error);
        }

        try {
          const subTypeResponse = await getSportSubTypes(sportId);

          if (Array.isArray(subTypeResponse?.subtypes)) {
            setSportSubTypes(subTypeResponse.subtypes);
          } else {
            setSportSubTypes([]);
          }
        } catch (error) {
          console.error("Error fetching sport subtypes:", error);
        }

        try {
          const sportDetailsResponse = await getSportDetails(sportId);
          setSport(sportDetailsResponse?.sport || null);
        } catch (error) {
          console.error("Error fetching sport details:", error);
        }

        try {
          const ageCategoriesResponse = await getSportAgeCategories(sportId);
          setAgeCategories(ageCategoriesResponse?.ageCategories || []);
        } catch (error) {
          console.error("Error fetching age categories:", error);
        }

      } catch (error) {
        console.error("Error in fetchSportDetails:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load sport details"
        });
      }
    };

    if (open && sportId) {
      fetchSportDetails();
    }
  }, [open, sportId, toast]);

  // Modify the handleAgeCategoryChange function
  const handleAgeCategoryChange = async (categoryId: string) => {
    setSelectedAgeCategory(categoryId);
    setValue('ageCategory', categoryId);
    setValue('distance', ''); // Reset distance selection

    setSelectedStudents([]);
    setSubstitutes([]); // Reset substitutes when age category changes
    setValue('studentIds', []);

    // Find the selected age category details
    const selectedCategory = ageCategories.find(cat => cat._id === categoryId);

    // Handle distance filtering for both Running and Swimming
    if (selectedCategory) {
      let allowedDistances: string[] = [];

      if (sport?.name === 'Running') {
        allowedDistances = runningAgeDistanceMap[selectedCategory.ageGroup] || [];
      } else if (sport?.name === 'Swimming') {
        allowedDistances = swimmingAgeDistanceMap[selectedCategory.ageGroup] || [];
      }

      if (sport?.name === 'Running' || sport?.name === 'Swimming') {
        const filtered = distances.filter(distance => {
          const distanceLabel = distance.category || distance.name || `${distance.value} ${distance.unit}`;
          return allowedDistances.includes(distanceLabel as string);
        });
        setFilteredDistances(filtered);
      } else {
        setFilteredDistances(distances);
      }
    }

    // Fetch eligible students for this category
    if (sport?._id && categoryId) {
      try {
        setLoadingStudents(true);
        const response = await getEligibleStudents(sport._id, categoryId);

        setEligibleStudents(response.students || []);
        setIsGroupSport(response.isGroupSport || false);
        setMinStudentsRequired(response.minRequired || 1);
      } catch (error: unknown) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load eligible students"
        });
      } finally {
        setLoadingStudents(false);
      }
    }
  };

  // Handle student toggle with proper typing
  const handleStudentToggle = (student: Student) => {
    setSelectedStudents(prevSelected => {
      let newSelected;
      const isAlreadySelected = prevSelected.some(s => s._id === student._id);
      
      if (isAlreadySelected) {
        // Remove student if already selected
        newSelected = prevSelected.filter(s => s._id !== student._id);

        // Also remove from substitutes if it was a substitute
        if (substitutes.some(s => s._id === student._id)) {
          setSubstitutes(prev => prev.filter(s => s._id !== student._id));
        }
      } else {
        // Add student if not already selected
        newSelected = [...prevSelected, student];

        // For group sports, limit to 9 students
        if (isGroupSport && newSelected.length > 9) {
          newSelected = newSelected.slice(0, 9); // Keep only the first 9
        }

        // For individual sports, only allow one student if not a school
        if (!isGroupSport && !isSchool && newSelected.length > 1) {
          newSelected = [student]; // Replace with just this student
        }
      }

      // Update form data
      setValue('studentIds', newSelected.map(s => s._id));

      return newSelected;
    });
  };

  // Handle substitute toggle with proper typing
  const handleSubstituteToggle = (student: Student) => {
    // Only allow toggle if student is selected
    const isSelected = selectedStudents.some(s => s._id === student._id);
    if (!isSelected) {
      return;
    }

    setSubstitutes(prev => {
      // If already a substitute, remove from substitutes
      const isAlreadySubstitute = prev.some(s => s._id === student._id);
      if (isAlreadySubstitute) {
        return prev.filter(s => s._id !== student._id);
      }

      // Check if already have 2 substitutes
      if (prev.length >= 2) {
        toast({
          title: "Maximum Substitutes",
          description: "You can only select up to 2 substitutes",
          variant: "destructive"
        });
        return prev;
      }

      // Add to substitutes
      return [...prev, student];
    });
  };

  useEffect(() => {
    // Update the form value whenever selectedStudents changes
    setValue('studentIds', selectedStudents.map(s => s._id));
  }, [selectedStudents, setValue]);

  // Handle registration type change
  const handleRegistrationTypeChange = (value: string) => {
    setRegistrationType(value);
    // Reset school data if switching to self-registration
    if (value === 'self') {
      setSchoolCode('');
      setSchoolData(null);
      setSchoolCodeVerified(false);
    }
  };
  
  // Handle school code change
  const handleSchoolCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSchoolCode(e.target.value);
    setSchoolCodeVerified(false);
    setSchoolData(null);
  };
  
  // Verify school code
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
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to verify school code"
      });
      setSchoolCodeVerified(false);
      setSchoolData(null);
    } finally {
      setVerifyingSchool(false);
    }
  };

  // Update onSubmitStep1 to work with Student objects
  const onSubmitStep1 = async (data: {
    ageCategory: string;
    distance?: string;
    sportSubType?: string;
    studentIds: string[];
  }) => {
    try {
      // Collect student IDs
      let studentIds = selectedStudents.map(student => student._id);
      
      // For team sports, we need at least the minimum number of players
      if (isGroupSport && studentIds.length < minStudentsRequired) {
        toast({
          variant: "destructive",
          title: "Error",
          description: `You need to select at least ${minStudentsRequired} players for this sport.`
        });
        return;
      }

      // Basic validation
      if (!sport) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select a sport"
        });
        return;
      }

      if (!data.ageCategory) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select an age category"
        });
        return;
      }

      // For sports with distances, validate distance selection
      if (sport.name === 'Running' || sport.name === 'Swimming') {
        if (!data.distance) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Please select a distance"
          });
          return;
        }
      }

      // For sports with sub-types, validate sub-type selection
      if (sportSubTypes.length > 0 && !data.sportSubType) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select a sport sub-type"
        });
        return;
      }

      if (registrationType === 'school' && !schoolCode) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please enter school code"
        });
        return;
      }

      // If registering under a school, validate the school code
      let schoolId = null;
      console.log(registrationType, schoolCode);
      if (registrationType === 'school' && schoolCode) {
        try {
          const response = await verifySchoolCode(schoolCode.trim());
          if (response.success) {
            schoolId = response.schoolId;
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description: response.message || "Invalid school code"
            });
            return;
          }
        } catch (error: unknown) {
          toast({
            variant: "destructive",
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to validate school code"
          });
          return;
        }
      }

      // Prepare form data
      const formDataUpdate: FormData = {
        sportId: sport._id,
        studentIds,
        eventId: eventId || "67e272e82f696a82ddc6d7b1",
        ageCategoryId: data.ageCategory,
        distanceId: data.distance,
        sportSubTypeId: data.sportSubType,
        isGroupSport: isGroupSport,
        substitutes: substitutes.map(sub => sub._id),
        schoolId: schoolId
      };

      // Update form data and move to next step
      setFormData(formDataUpdate);
      setStep(2);
    } catch (error: unknown) {
      console.error("Error in step 1 submission:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to proceed to the next step"
      });
    }
  };

  const handleSubmitPaymentDetails = async (
    paymentScreenshot: File, 
    transactionId: string
  ) => {
    try {
      if (!transactionId.trim()) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Transaction ID is required"
        });
        return;
      }

      // Create form data for file upload
      const formDataObj = new FormData();

      // Add registration type and school ID if applicable
      formDataObj.append('registrationType', registrationType);
      if (registrationType === 'school' && schoolData?._id) {
        formDataObj.append('schoolId', schoolData._id);
      }

      // Fix: Use correct field name based on sport type
      const studentIds = formData?.studentIds || [];
      if (isGroupSport || studentIds.length > 0) {
        // For group sports, use studentIds array
        formData?.studentIds.forEach(id => {
          formDataObj.append('studentIds', id);
        });
      } else {
        // For individual sports, use studentId (singular)
        if (formData?.studentIds[0]) {
          formDataObj.append('studentId', formData.studentIds[0]);
        }
      }

      // Add other form data
      if (formData?.sportId) formDataObj.append('sportId', formData.sportId);
      formDataObj.append('isGroupSport', isGroupSport.toString());

      if (formData?.eventId) formDataObj.append('eventId', formData.eventId);
      if (formData?.ageCategoryId) formDataObj.append('ageCategoryId', formData.ageCategoryId);
      if (formData?.distanceId) formDataObj.append('distanceId', formData.distanceId);
      if (formData?.sportSubTypeId) formDataObj.append('sportSubTypeId', formData.sportSubTypeId);
      
      // Add substitutes to form data
      if (formData?.substitutes && formData.substitutes.length > 0) {
        formData.substitutes.forEach(id => {
          formDataObj.append('substitutes', id);
        });
      }

      formDataObj.append('paymentScreenshot', paymentScreenshot);
      formDataObj.append('transactionId', transactionId);

      // Register the student with payment details
      const response = await registerStudentsForSport(formDataObj);

      if (response.success) {
        // Set the student name or count for the confirmation dialog
        if (isGroupSport) {
          setRegisteredStudentCount(response.studentCount || formData?.studentIds.length || 0);
        }

        // Show the confirmation dialog
        setShowConfirmation(true);

        if (onSuccess) onSuccess(response.registration);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message || "Registration failed"
        });
      }
    } catch (error: unknown) {
      console.error("Error in handleSubmitPaymentDetails:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to complete registration"
      });
    }
  };

  // Function to navigate to students page
  const handleAddStudent = () => {
    if (onOpenChange) {
      onOpenChange(false); // Close the dialog
    }
    navigate('/parent/students'); // Navigate to the students page
  };

  // If sportName is not available, use the name from the sport object
  const displaySportName = sportName || (sport?.name) || "Sport";

  // Get the price for the current sport
  const sportPrice = sportPricingMap[sport?.name as keyof typeof sportPricingMap] || 0;

  // Calculate total price based on the sport type
  // For team sports (Cricket and Football), use flat fee regardless of number of students
  const totalPrice = isGroupSport ? sportPrice : (selectedStudents.length > 0 ? sportPrice * selectedStudents.length : sportPrice);

  // Add this function to filter students based on search query
  const filteredStudents = eligibleStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-none bg-background z-40 pb-4 border-b">
            <DialogTitle>Register for {displaySportName}</DialogTitle>
            <DialogDescription>
              {step === 1
                ? "First select an age category, then select eligible students"
                : "Complete payment details to finalize registration"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            {step === 1 ? (
              <form id="sport-registration-form" onSubmit={handleSubmit(onSubmitStep1)} className="pt-2 overflow-y-auto">
                <div className="space-y-4 pb-6">
                  {/* Age Category Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="ageCategory">Select Age Category First *</Label>
                    <Select
                      onValueChange={handleAgeCategoryChange}
                      value={selectedAgeCategory}
                    >
                      <SelectTrigger id="ageCategory">
                        <SelectValue placeholder="Select age category" />
                      </SelectTrigger>
                      <SelectContent>
                        {ageCategories.map((category) => (
                          <SelectItem
                            key={category._id}
                            value={category._id}
                          >
                            {category.ageGroup}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input
                      type="hidden"
                      {...register('ageCategory', { required: 'Please select an age category' })}
                    />
                    {errors.ageCategory && (
                      <p className="text-sm text-red-500">{errors.ageCategory.message}</p>
                    )}
                  </div>

                  {/* Add Registration Type Selection for parents with individual sports */}
                  {isParent && !isGroupSport && (
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

                  {/* Add Distance Selection */}
                  {distances.length > 0 && (
                    <div className="space-y-2">
                      <Label htmlFor="distance">Select Distance *</Label>
                      <Select
                        onValueChange={(value) => setValue('distance', value)}
                        disabled={(sport?.name === 'Running' || sport?.name === 'Swimming') && filteredDistances.length === 0}
                      >
                        <SelectTrigger id="distance">
                          <SelectValue placeholder="Select distance" />
                        </SelectTrigger>
                        <SelectContent>
                          {((sport?.name === 'Running' || sport?.name === 'Swimming') ? filteredDistances : distances).map((distance) => (
                            <SelectItem
                              key={distance._id}
                              value={distance._id}
                            >
                              {distance.category || distance.name || `${distance.value} ${distance.unit}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <input
                        type="hidden"
                        {...register('distance', { required: 'Please select a distance' })}
                      />
                      {errors.distance && (
                        <p className="text-sm text-red-500">{errors.distance.message}</p>
                      )}
                      {(sport?.name === 'Running' || sport?.name === 'Swimming') && selectedAgeCategory && filteredDistances.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          No distances available for this age category in {sport.name}
                        </p>
                      )}
                    </div>
                  )}

                  {sportSubTypes.length > 0 && (
                    <div className="space-y-2">
                      <Label htmlFor="sportSubType">Select Category *</Label>
                      <Select
                        onValueChange={(value) => {
                          setValue('sportSubType', value);
                        }}
                      >
                        <SelectTrigger id="sportSubType">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {sportSubTypes.map((subType) => {
                            const displayName = subType.name || subType.type || 'Unknown';
                            return (
                              <SelectItem
                                key={subType._id}
                                value={subType._id}
                              >
                                {displayName}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <input
                        type="hidden"
                        {...register('sportSubType', { required: 'Please select a category' })}
                      />
                      {errors.sportSubType && (
                        <p className="text-sm text-red-500">{errors.sportSubType.message}</p>
                      )}
                    </div>
                  )}

                  {/* Student Selection with Checkboxes */}
                  {selectedAgeCategory && (
                    <div className="space-y-2">
                      <Label>
                        Select {isGroupSport
                          ? "Students (maximum 9 allowed)"
                          : isSchool
                            ? "Students"
                            : "a Student"} *
                      </Label>

                      {isGroupSport && (
                        <div className="bg-blue-50 p-3 rounded-md mb-4 text-blue-800 text-sm flex items-start">
                          <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Team Sport Requirements</p>
                            <p>Please select at least {minStudentsRequired} players. You can mark up to 2 players as substitutes.</p>
                          </div>
                        </div>
                      )}

                      {loadingStudents ? (
                        <div className="text-sm text-muted-foreground py-2">
                          <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                          Loading eligible students...
                        </div>
                      ) : eligibleStudents.length > 0 ? (
                        <>
                          <div className="mb-3">
                            <Input
                              type="text"
                              placeholder="Search students by name..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full"
                            />
                          </div>
                          <div className="max-h-[200px] overflow-y-auto space-y-2 border rounded-md p-2">
                            {filteredStudents.map((student) => (
                              <div
                                key={student._id}
                                className={`flex items-center justify-between p-2 rounded ${!student.isEligible ? 'opacity-50' : ''}`}
                              >
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`student-${student._id}`}
                                    checked={selectedStudents.includes(student)}
                                    onCheckedChange={() => student.isEligible && handleStudentToggle(student)}
                                    disabled={!student.isEligible ||
                                      (!isGroupSport && !isSchool && selectedStudents.length === 1 && !selectedStudents.includes(student)) ||
                                      (isGroupSport && selectedStudents.length >= 9 && !selectedStudents.includes(student))}
                                  />
                                  <Label
                                    htmlFor={`student-${student._id}`}
                                    className={`cursor-pointer ${!student.isEligible ? 'text-gray-500' : ''}`}
                                  >
                                    {student.name}
                                    {student.isRegistered && " (Already registered)"}
                                    {!student.isRegistered && !student.isEligible && " (Not eligible)"}
                                    {student.age && " - Age: " + student.age}
                                  </Label>
                                </div>

                                {/* Substitute checkbox - only for group sports and selected students */}
                                {isGroupSport && selectedStudents.includes(student) && (
                                  <div className="flex items-center space-x-2">
                                    {(substitutes.length < 2 || substitutes.includes(student)) && (
                                      <>
                                        <Checkbox
                                          id={`substitute-${student._id}`}
                                          checked={substitutes.includes(student)}
                                          onCheckedChange={() => handleSubstituteToggle(student)}
                                        />
                                        <Label
                                          htmlFor={`substitute-${student._id}`}
                                          className="text-sm"
                                        >
                                          Substitute
                                        </Label>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-muted-foreground py-2 space-y-4">
                          <p>No eligible students found for this age category</p>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleAddStudent}
                            className="w-full flex items-center justify-center gap-2"
                          >
                            <PlusCircle className="h-4 w-4" />
                            Add Student
                          </Button>
                        </div>
                      )}

                      <input
                        type="hidden"
                        {...register('studentIds', {
                          required: 'Please select at least one student',
                          validate: value => {
                            if (isGroupSport) {
                              return value.length <= 9 || "You can select a maximum of 9 students for group sports.";
                            }
                            if (!isSchool) {
                              return value.length === 1 || 'Please select exactly one student';
                            }
                            return value.length > 0 || 'Please select at least one student';
                          }
                        })}
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-between mt-4">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      loading ||
                      (!selectedAgeCategory) ||
                      (selectedStudents.length === 0) ||
                      (registrationType === 'school' && !schoolCodeVerified)
                    }
                  >
                    Next Step
                  </Button>
                </div>
              </form>
            ) : (
              <PaymentDetailsForm
                onSubmit={handleSubmitPaymentDetails}
                onBack={() => setStep(1)} // Add this line to handle going back to step 1
                onClose={onClose}
                sportName={displaySportName}
                price={totalPrice}
                participantCount={selectedStudents.length}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <RegistrationConfirmationDialog
        open={showConfirmation}
        onOpenChange={(open) => {
          setShowConfirmation(open);
          if (!open && onOpenChange) {
            onOpenChange(false);
          }
        }}
        studentName={selectedStudents.length.toString()}
        sportName={displaySportName}
        isGroup={isGroupSport}
        studentCount={registeredStudentCount}
      />
    </>
  );
}