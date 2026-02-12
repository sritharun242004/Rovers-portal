import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/useToast';
import { updateStudent } from '@/api/parent';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Upload } from 'lucide-react';
import ReactFlagsSelect from 'react-flags-select';
import { format } from 'date-fns';
import { Alert, AlertDescription } from "@/components/ui/alert";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { ChevronsUpDown } from 'lucide-react';
import { countryNames } from '@/utils/countryList';
import { Loader2 } from 'lucide-react';

interface Student {
  _id: string;
  name: string;
  dob?: string;
  gender?: string;
  nationality?: string;
  nationalityCode?: string;
  city?: string;
  uid?: string;
  class?: string;
  bloodGroup?: string;
  medicalConditions?: string;
  photo?: string;
  idProof?: string;
}

interface EditStudentFormProps {
  student: Student;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  dob: string;
  gender: string;
  nationality: string;
  nationalityCode: string;
  city: string;
  uid: string;
  class: string;
  bloodGroup: string;
  medicalConditions: string;
  photo: FileList | string;
  idProof: FileList | string;
}

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
const genders = ['male', 'female', 'other'];
const relationships = ['father', 'mother', 'guardian', 'coach', 'other'];

// Mock data for schools/academies - these would be fetched from API in production
const schools = [
 'Adab Iranian Private School - Boys',
'Adab Iranian Private School - Girls',
'Al Ameen Private School',
'Al Arqam Private School',
'Al Basateen Kindergarten - Al Khawaneej',
'Al Basateen Kindergarten - Hatta',
'Al Diyafah High School',
'Al Eman Private School',
'Al Ittihad Private School - Al Mamzar',
'Al Ittihad Private School - Jumeirah',
'Al Khaleej National School',
'Al Maaref Private School',
'Al Mawakeb School - Al Barsha',
'Al Mawakeb School - Al Garhoud',
'Al Rashid Al Saleh Private School',
'Al Sadiq Islamic English School',
'Al Safa Private School',
'Al Salam Private School',
'Al Shorouq Private School',
'Ambassador Kindergarten',
'Al Mizhar American Academy Private School for Girls',
'American International School',
'American School of Dubai',
'Apple International School',
'Arab Unity School',
'Bradenton Preparatory Academy',
'Buds Public School',
'Cambridge International School',
'Collegiate American School',
'Crescent English School',
'Dar Al Marefa Private School',
'Deira International School',
'Deira Private School',
'Delhi Private School Dubai',
'GEMS Dubai American Academy',
'Dubai Arab American Private School',
'Dubai British School',
'Dubai Carmel School',
'Dubai College',
'Dubai English Speaking College',
'Dubai English Speaking School',
'Dubai Gem Private School',
'Dubai International Academy',
'Dubai International School - Al Garhoud',
'Dubai International School - Al Quoz',
'Dubai Modern Education School',
'GEMS Modern Academy',
'Dubai National School - Al Barsha',
'Dubai National School - Al Twar',
'Dubai Police Kindergarten - Deira',
'Dubai Scholars Private School',
`'Dubai Women's College High School`,
'Emirates English Speaking School',
'Emirates International School - Jumeirah',
'Emirates International School - Meadows',
'English Language Private School',
'GEMS Jumeirah Primary School',
'GEMS Royal Dubai School',
'GEMS Wellington Academy - DSO',
'GEMS Wellington International School',
'GEMS Wellington Primary School',
'GEMS Winchester School',
'GEMS World Academy',
'German International School Dubai',
'Ambassador School',
'Grammar School',
'Greenfield Community School',
'Greenwood International School',
'Gulf Indian High School',
'Gulf Model School',
'His Highness Shaikh Rashid Al Maktoum Pakistani School',
'Horizon English School',
'Institute of Applied Technology',
'International Academic School',
'International School of Arts and Sciences',
'Islamic School for Education and Training',
'Japanese School in Dubai',
'Jebel Ali Primary School',
'JSS International School',
'JSS Private School',
'Jumeira Baccalaureate School',
'Jumeirah College',
'Jumeirah English Speaking School',
'Jumeirah English Speaking School - Arabian Ranches',
'K12 International Academy',
'Khadija Al Kobra Iranian School for Girls',
`'Kings' Dubai`,
'Latifa School for Girls',
'Little Flowers English School',
'Lycee Francais International School',
'Lycee Georges Pompidou High School',
'Lycee Georges Pompidou Primary School',
'Lycee Libanais Francophone Prive',
'Mirdif Private School',
'National Charity School',
'New Academy School',
'New Indian Model School',
'New World Private School',
'Nibras International School',
'North American International School',
'GEMS Our Own English High School',
'Our Own High School - Dubai',
'GEMS Our Own Indian School',
'Pakistan Education Academy',
'Philadelphia Private School',
'Pristine Private School',
'Queen International School',
'Raffles International School - South Campus',
'Raffles World Academy',
'Rajagiri International School',
'Rashid School for Boys',
'Regent International School',
'Repton School Dubai',
'Russian International School',
'Salman Al Farsi Iranian School',
'School of Modern Skills',
'Sharjah American International School',
'St. Marys Catholic High School',
'Star International School - Al Twar',
'Star International School - Mirdif',
'Horizon International Schoool',
'The Central School',
'The Childrens Garden',
'The City School International',
'The Elite English School',
'The English College - Dubai',
'The Indian Academy',
'The Indian High School',
'The Indian High School - Branch',
'The Indian International School',
'The International School of Choueifat - DIP',
'The International School of Choueifat - Dubai',
'The Kindergarten Starters',
'The Millennium School',
'The Oxford School',
'The Philippine School',
'Sheikh Rashid Bin Saeed Islamic Institute',
'The School of Research Science',
'The Sheffield Private School',
'The Westminster School',
'The Winchester School',
'Towheed Iranian School for Boys',
'Towheed Iranian School for Girls',
'United International Private School',
'Universal American School',
'Uptown School',
'Delhi Private School Academy',
'GEMS New Millennium School',
'Sabari Indian School',
'Springdales School',
'Victory Heights Primary School',
'Foremarke School',
'International Concept for Education',
'GEMS Wellington Academy - Al Khail',
'Oasis School',
'GEMS International School - Al Khail',
'Credence High School',
'Bilva Indian School',
'GEMS FirstPoint School',
'Kings Nad Al Sheba',
'Ontario International Canadian School',
'Nord Anglia International School Dubai',
`'Kings' Al Barsha`,
'Gems Metropole School',
'Safa Community School',
'Dovecote Green Primary',
'Capital School',
'Amled School',
'Swiss International Scientifc School',
'Hartland Internaitnal School',
'St Mary High Catholic School -branch',
'Dubai British School - Jumairah Park',
'Ranches Primary School'
];

const classes = [
 "Home School", "KG 1", "KG 2", 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
  'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10',
  'Grade 11', 'Grade 12'
];

export function EditStudentForm({ student, onSuccess, onCancel }: EditStudentFormProps) {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FormData>({
    defaultValues: {
      name: student?.name || '',
      dob: student?.dob ? new Date(student?.dob).toISOString().split('T')[0] : '',
      gender: student?.gender || '',
      nationality: student?.nationality || '',
      nationalityCode: student?.nationalityCode || '',
      city: student?.city || '',
      uid: student?.uid || '',
      class: student?.class || '',
      bloodGroup: student?.bloodGroup || '',
      medicalConditions: student?.medicalConditions || '',
      photo: student?.photo || '',
      idProof: student?.idProof || ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(student?.nationalityCode || '');
  const { toast } = useToast();

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      
      // Create FormData object
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(data).forEach(key => {
        if (key !== 'photo' && key !== 'idProof') {
          formData.append(key, data[key]);
        }
      });

      // Handle file uploads
      if (data.photo instanceof FileList && data.photo.length > 0) {
        formData.append('photo', data.photo[0]);
      }
      
      if (data.idProof instanceof FileList && data.idProof.length > 0) {
        formData.append('idProof', data.idProof[0]);
      }

      const response = await updateStudent(student._id, formData);

      if (response.success) {
        toast({
          title: "Success",
          description: "Student updated successfully",
        });
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error in onSubmit:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update student",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setValue('nationalityCode', countryCode);
    
    // Get country name from the country code
    const countryName = countryNames[countryCode];
    if (countryName) {
      setValue('nationality', countryName);
    }
  };

  return (
    <Card className="w-full max-w-[95vw] mx-auto flex flex-col h-[calc(100vh-4rem)]">
      <CardHeader className="flex-none bg-background border-b">
        <CardTitle>Edit Student Information</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 md:p-6">
        <form id="edit-student-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter student's full name"
                className="w-full"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                {...register('dob')}
                className="w-full"
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                onValueChange={(value) => setValue('gender', value)}
                defaultValue={student.gender || ""}
              >
                <SelectTrigger id="gender" className="w-full">
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
              <input type="hidden" {...register('gender')} />
            </div>

            {/* Nationality */}
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <ReactFlagsSelect
                selected={selectedCountry}
                onSelect={handleCountryChange}
                placeholder="Select country"
                searchable
                className="react-flags-select-container w-full"
              />
              <input type="hidden" {...register('nationalityCode')} />
              <input type="hidden" {...register('nationality')} />
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                {...register('city')}
                placeholder="Enter city"
                className="w-full"
              />
            </div>

            {/* Nationality ID */}
            <div className="space-y-2">
              <Label htmlFor="uid">Nationality ID</Label>
              <Input
                id="uid"
                {...register('uid')}
                placeholder="Enter nationality ID"
                className="w-full"
              />
            </div>

            {/* Class/Grade */}
            <div className="space-y-2">
              <Label htmlFor="class">Class/Grade</Label>
              <Select
                onValueChange={(value) => setValue('class', value)}
                defaultValue={student.class || ""}
              >
                <SelectTrigger id="class" className="w-full">
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
              <input type="hidden" {...register('class')} />
            </div>

            {/* Blood Group */}
            <div className="space-y-2">
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Select
                onValueChange={(value) => setValue('bloodGroup', value)}
                defaultValue={student.bloodGroup || "Unknown"}
              >
                <SelectTrigger id="bloodGroup" className="w-full">
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

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label htmlFor="photo">Student Photo *</Label>
              <div className="flex flex-col space-y-2">
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  {...register('photo', { required: 'Photo is required' })}
                  className="w-full"
                />
                {student?.photo && (
                  <div className="mt-2">
                    <img src={student.photo} alt="Current" className="w-20 h-20 object-cover rounded" />
                  </div>
                )}
              </div>
              {errors.photo && <p className="text-sm text-red-500">{errors.photo.message}</p>}
            </div>

            {/* ID Proof Upload */}
            <div className="space-y-2">
              <Label htmlFor="idProof">ID Proof</Label>
              <div className="flex flex-col space-y-2">
                <Input
                  id="idProof"
                  type="file"
                  accept="image/*,.pdf"
                  {...register('idProof')}
                  className="w-full"
                />
                {student?.idProof && (
                  <div className="mt-2">
                    <a href={student.idProof} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      View current ID proof
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Medical Conditions */}
            <div className="space-y-2 col-span-full">
              <Label htmlFor="medicalConditions">Medical Conditions</Label>
              <Textarea
                id="medicalConditions"
                {...register('medicalConditions')}
                placeholder="Enter any medical conditions or allergies"
                className="h-24 w-full"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-none bg-background border-t p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-end gap-2 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-student-form"
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}