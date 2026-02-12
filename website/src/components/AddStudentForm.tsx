import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/useToast';
import { addStudent, getSportsOptions, getDistancesOptions, getSportSubTypesOptions } from '@/api/parent';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Upload } from 'lucide-react';
import ReactFlagsSelect from 'react-flags-select';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { countryNames } from "@/utils/countryList";

const genders = ['male', 'female', 'other'];
const relationships = ['father', 'mother', 'guardian', 'coach', 'other'];

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];

const classes = [
  "Home School", "KG 1", "KG 2", 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
  'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10',
  'Grade 11', 'Grade 12'
];

export function AddStudentForm({ onSuccess, onCancel }) {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { userRole } = useAuth();
  const photoRef = useRef(null);
  const idProofRef = useRef(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [idProofFile, setIdProofFile] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [idProofError, setIdProofError] = useState('');
  const watchDob = watch('dob');
  const [open, setOpen] = useState(false);
  const [schoolValue, setSchoolValue] = useState("");

  // New state for dropdown options
  const [sportsOptions, setSportsOptions] = useState([]);
  const [distancesOptions, setDistancesOptions] = useState([]);
  const [sportSubTypesOptions, setSportSubTypesOptions] = useState([]);
  const [selectedSport, setSelectedSport] = useState('');
  const [sportDistances, setSportDistances] = useState([]);
  const watchSport = watch('sport');

  // Fetch dropdown options on component mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Fetch sports and distances
        const [sportsResponse, distancesResponse] = await Promise.all([
          getSportsOptions(),
          getDistancesOptions()
        ]);

        if (sportsResponse.success) {
          setSportsOptions(sportsResponse.sports);
        }

        if (distancesResponse.success) {
          setDistancesOptions(distancesResponse.distances);
        }
      } catch (error) {
        console.error('Error fetching dropdown options:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load form options"
        });
      }
    };

    fetchOptions();
  }, [toast]);

  // Fetch sport sub types and distances when sport changes
  useEffect(() => {
    const fetchSportData = async () => {
      if (watchSport) {
        try {
          // Fetch sport sub types
          const subTypesResponse = await getSportSubTypesOptions(watchSport);
          if (subTypesResponse.success) {
            setSportSubTypesOptions(subTypesResponse.sportSubTypes);
          }

          // Fetch distances for this sport
          const distancesResponse = await fetch(`/api/sports/${watchSport}/distances`);
          if (distancesResponse.ok) {
            const distancesData = await distancesResponse.json();
            setSportDistances(distancesData.distances || []);
          }
        } catch (error) {
          console.error('Error fetching sport data:', error);
          setSportSubTypesOptions([]);
          setSportDistances([]);
        }
      } else {
        setSportSubTypesOptions([]);
        setSportDistances([]);
      }
    };

    fetchSportData();
  }, [watchSport]);

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];

      if (!validTypes.includes(file.type)) {
        setPhotoError('Invalid file format. Please upload a JPG or PNG image.');
        setPhotoFile(null);
        e.target.value = '';
        return;
      }

      setPhotoError('');
      setPhotoFile(file);
    }
  };

  const handleIdProofChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

      if (!validTypes.includes(file.type)) {
        setIdProofError('Invalid file format. Please upload a JPG, PNG image or PDF document.');
        setIdProofFile(null);
        e.target.value = '';
        return;
      }

      setIdProofError('');
      setIdProofFile(file);
    }
  };

  const handleCountryChange = (countryCode) => {
    setSelectedCountry(countryCode);

    // Store both the country code and full country name
    setValue('nationalityCode', countryCode);
    setValue('nationality', countryNames[countryCode] || countryCode);

    console.log(`Selected country: ${countryCode} - ${countryNames[countryCode] || countryCode}`);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      console.log('Form submission started with data:', data);

      // For school role, validate required fields
      if (userRole === 'school') {
        if (!data.name || !data.parentEmail || !data.parentName || !data.phoneNumber || !data.countryCode || !data.uid) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Please fill in all required fields"
          });
          setLoading(false);
          return;
        }
      } else {
        // For parent role, validate all required fields
        if (!idProofFile) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Aadhaar/UAE ID is required"
          });
          setLoading(false);
          return;
        }

        // Photo is optional for all users
        // if (!photoFile) {
        //   toast({
        //     variant: "destructive",
        //     title: "Error",
        //     description: "Participant Photo is required"
        //   });
        //   setLoading(false);
        //   return;
        // }
      }

      const formData = new FormData();

      // Append all text fields, excluding empty values for required fields
      Object.keys(data).forEach(key => {
        if (key !== 'photo' && key !== 'idProof') {
          const value = data[key];
          // Only append non-empty values, or explicitly handle empty strings for optional fields
          if (value && value !== '') {
            formData.append(key, value);
            console.log(`Appending form data: ${key} = ${value}`);
          } else if (key === 'bloodGroup' && (!value || value === '')) {
            // Set default for blood group if empty
            formData.append(key, 'Unknown');
            console.log(`Appending default blood group: Unknown`);
          }
        }
      });

      // Append files if they exist
      if (photoFile) {
        formData.append('photo', photoFile);
        console.log('Appending photo file:', photoFile.name);
      }

      if (idProofFile) {
        formData.append('idProof', idProofFile);
        console.log('Appending ID proof file:', idProofFile.name);
      }

      console.log('Submitting form data to API');
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, `File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${key}:`, value);
        }
      }

      const response = await addStudent(formData);

      console.log('API response:', response);
      toast({
        title: "Success",
        description: response.message || "Student added successfully!"
      });

      reset();
      setPhotoFile(null);
      setIdProofFile(null);
      setSelectedCountry('');
      setPhotoError('');
      setIdProofError('');

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error in onSubmit:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An unknown error occurred"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add New Student</CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto max-h-[70vh]">
        <form id="add-student-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student Name - Required for all roles */}
            <div className="space-y-2">
              <Label htmlFor="name">Student Name *</Label>
              <Input
                id="name"
                {...register('name', { required: 'Name is required' })}
                placeholder="Enter student's full name"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            {/* Parent Email - Required for school role */}
            {userRole === 'school' && (
              <div className="space-y-2">
                <Label htmlFor="parentEmail">Parent Email *</Label>
                <Input
                  id="parentEmail"
                  type="email"
                  {...register('parentEmail', {
                    required: userRole === 'school' ? 'Parent email is required' : false
                  })}
                  placeholder="Enter parent's email"
                />
                {errors.parentEmail && <p className="text-sm text-red-500">{errors.parentEmail.message}</p>}
              </div>
            )}

            {/* Parent Name - Required for school role */}
            {userRole === 'school' && (
              <div className="space-y-2">
                <Label htmlFor="parentName">Parent Name *</Label>
                <Input
                  id="parentName"
                  {...register('parentName', {
                    required: userRole === 'school' ? 'Parent name is required' : false
                  })}
                  placeholder="Enter parent's name"
                />
                {errors.parentName && <p className="text-sm text-red-500">{errors.parentName.message}</p>}
              </div>
            )}

            {/* Phone Number - Required for school role */}
            {userRole === 'school' && (
              <div className="space-y-2">
                <Label>Phone Number *</Label>
                <PhoneInput
                  country={'ae'} // Default country (UAE)
                  value={watch('phoneNumber')}
                  onChange={(phone, data) => {
                    // Update phoneNumber with full number
                    setValue('phoneNumber', phone);

                    // Update countryCode separately if needed
                    const countryCode = data?.dialCode;
                    if (countryCode) {
                      setValue('countryCode', `+${countryCode}`);
                    }
                  }}
                  inputClass="w-full p-2 border rounded"
                  containerClass="w-full"
                />
                <input
                  type="hidden"
                  {...register('countryCode', {
                    required: userRole === 'school' ? 'Country code is required' : false
                  })}
                />
                {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>}
              </div>
            )}

            {/* Student UID - Required for school role */}
            <div className="space-y-2">
              <Label htmlFor="uid">Nationality ID *</Label>
              <Input
                id="uid"
                {...register('uid', { required: 'Student UID is required' })}
                placeholder="Enter student UID"
              />
              {errors.uid && <p className="text-sm text-red-500">{errors.uid.message}</p>}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth {userRole === 'parent' ? '*' : ''}</Label>
              <Input
                id="dob"
                type="date"
                {...register('dob', { required: userRole === 'parent' ? 'Date of birth is required' : false })}
              />
              {errors.dob && <p className="text-sm text-red-500">{errors.dob.message}</p>}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender">Gender {userRole === 'parent' ? '*' : ''}</Label>
              <Select onValueChange={(value) => setValue('gender', value)} defaultValue="">
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {genders.map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" {...register('gender', {
                required: userRole === 'parent' ? 'Gender is required' : false,
                validate: (value) => {
                  if (userRole === 'parent' && (!value || value === '')) {
                    return 'Please select a gender';
                  }
                  if (value && !genders.includes(value)) {
                    return 'Please select a valid gender';
                  }
                  return true;
                }
              })} />
              {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
            </div>

            {/* Nationality */}
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality {userRole === 'parent' ? '*' : ''}</Label>
              <ReactFlagsSelect
                selected={selectedCountry}
                onSelect={handleCountryChange}
                placeholder="Select country"
                searchable
                className="react-flags-select-container"
              />
              <input type="hidden" {...register('nationalityCode')} />
              <input type="hidden" {...register('nationality', { required: userRole === 'parent' ? 'Nationality is required' : false })} />
              {errors.nationality && <p className="text-sm text-red-500">{errors.nationality.message}</p>}
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">City {userRole === 'parent' ? '*' : ''}</Label>
              <Input
                id="city"
                {...register('city', { required: userRole === 'parent' ? 'City is required' : false })}
                placeholder="Enter city"
              />
              {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
            </div>

            {/* Class/Grade */}
            <div className="space-y-2">
              <Label htmlFor="class">Class/Grade {userRole === 'parent' ? '*' : ''}</Label>
              <Select onValueChange={(value) => setValue('class', value)} defaultValue="">
                <SelectTrigger id="class">
                  <SelectValue placeholder="Select class/grade" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" {...register('class', { required: userRole === 'parent' ? 'Class/Grade is required' : false })} />
              {errors.class && <p className="text-sm text-red-500">{errors.class.message}</p>}
            </div>

            {/* Blood Group */}
            <div className="space-y-2">
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Select onValueChange={(value) => setValue('bloodGroup', value)} defaultValue="Unknown">
                <SelectTrigger id="bloodGroup">
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {bloodGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" {...register('bloodGroup')} />
            </div>

            {/* Relationship */}
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship with Athlete{userRole === 'parent' ? '*' : ''}</Label>
              <Select onValueChange={(value) => setValue('relationship', value)} defaultValue="parent">
                <SelectTrigger id="relationship">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  {relationships.map((rel) => (
                    <SelectItem key={rel} value={rel}>
                      {rel.charAt(0).toUpperCase() + rel.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" {...register('relationship', { required: userRole === 'parent' ? 'Relationship is required' : false })} />
              {errors.relationship && <p className="text-sm text-red-500">{errors.relationship.message}</p>}
            </div>



            {/* Sport Selection */}
            <div className="space-y-2">
              <Label htmlFor="sport">Sport *</Label>
              <Select onValueChange={(value) => setValue('sport', value)} defaultValue="">
                <SelectTrigger id="sport">
                  <SelectValue placeholder="Select sport" />
                </SelectTrigger>
                <SelectContent>
                  {sportsOptions.map((sport) => (
                    <SelectItem key={sport._id} value={sport._id}>
                      {sport.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" {...register('sport', { required: 'Sport is required' })} />
              {errors.sport && <p className="text-sm text-red-500">{errors.sport.message}</p>}
            </div>

            {/* Distance Selection - Conditional based on sport */}
            {sportDistances.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="distance">Distance *</Label>
                <Select onValueChange={(value) => setValue('distance', value)} defaultValue="">
                  <SelectTrigger id="distance">
                    <SelectValue placeholder="Select distance" />
                  </SelectTrigger>
                  <SelectContent>
                    {sportDistances.map((distance) => (
                      <SelectItem key={distance._id} value={distance._id}>
                        {distance.category} - {distance.value} {distance.unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" {...register('distance', { required: 'Distance is required for this sport' })} />
                {errors.distance && <p className="text-sm text-red-500">{errors.distance.message}</p>}
              </div>
            )}

            {sportDistances.length === 0 && watchSport && (
              <div className="space-y-2">
                <Label htmlFor="distance" className="text-gray-500">Distance</Label>
                <div className="text-sm text-gray-500 p-2 bg-gray-50 rounded border">
                  This sport does not require distances
                </div>
              </div>
            )}

            {/* Sport Sub Type Selection - Conditional */}
            <div className="space-y-2">
              <Label htmlFor="sportSubType">
                Sport Sub Type {sportSubTypesOptions.length > 0 ? '*' : '(Optional)'}
              </Label>
              <Select
                onValueChange={(value) => setValue('sportSubType', value)}
                defaultValue=""
                disabled={!watchSport}
              >
                <SelectTrigger id="sportSubType">
                  <SelectValue
                    placeholder={
                      !watchSport
                        ? "Select sport first"
                        : sportSubTypesOptions.length === 0
                          ? "No sub types available for this sport"
                          : "Select sport sub type"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {sportSubTypesOptions.map((subType) => (
                    <SelectItem key={subType._id} value={subType._id}>
                      {subType.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="hidden"
                {...register('sportSubType', {
                  required: sportSubTypesOptions.length > 0 ? 'Sport sub type is required for this sport' : false
                })}
              />
              {errors.sportSubType && <p className="text-sm text-red-500">{errors.sportSubType.message}</p>}
              {watchSport && sportSubTypesOptions.length === 0 && (
                <p className="text-sm text-gray-500">This sport does not have sub-categories.</p>
              )}
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label htmlFor="photo">Student Photo {userRole === 'parent' ? '*' : ''}</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="photo"
                  type="file"
                  ref={photoRef}
                  onChange={handlePhotoChange}
                  accept="image/jpeg,image/png,image/jpg"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => photoRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
                {photoFile && <span className="text-sm">{photoFile.name}</span>}
              </div>
              {photoError && <p className="text-sm text-red-500">{photoError}</p>}
            </div>

            {/* ID Proof Upload */}
            <div className="space-y-2">
              <Label htmlFor="idProof">ID Proof {userRole === 'parent' ? '*' : ''}</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="idProof"
                  type="file"
                  ref={idProofRef}
                  onChange={handleIdProofChange}
                  accept="image/jpeg,image/png,image/jpg,application/pdf"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => idProofRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload ID Proof
                </Button>
                {idProofFile && <span className="text-sm">{idProofFile.name}</span>}
              </div>
              {idProofError && <p className="text-sm text-red-500">{idProofError}</p>}
            </div>
          </div>

          {/* Medical Conditions - Optional for all roles */}
          <div className="space-y-2">
            <Label htmlFor="medicalConditions">Medical Conditions</Label>
            <Textarea
              id="medicalConditions"
              {...register('medicalConditions')}
              placeholder="Enter any medical conditions or allergies"
              className="h-24"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="add-student-form"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Student"}
        </Button>
      </CardFooter>
    </Card>
  );
}