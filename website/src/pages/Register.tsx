import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as Sentry from "@sentry/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { useToast } from "@/hooks/useToast";
import { UserPlus, Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  requestSignupOTP,
  verifySignupOTP,
  completeSignup,
  getSignupSports
} from "@/api/auth";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

// Step 1: Email + Role
type Step1Form = {
  email: string;
  role: string;
};

// Step 2: OTP Verification
type Step2Form = {
  otp: string;
};

// Step 3: Parent Details
type ParentForm = {
  name: string;
  countryCode: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
};

// Step 3: School Details
type SchoolForm = {
  name: string;
  schoolType: string;
  contactPersonName: string;
  contactPersonPhone: string;
  countryCode: string;
  address: string;
  sports: string[];
  provideVenue: boolean;
  password: string;
  confirmPassword: string;
};

export function Register() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [availableSports, setAvailableSports] = useState([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Forms for different steps
  const step1Form = useForm<Step1Form>({
    defaultValues: {
      role: "parent"
    }
  });

  const step2Form = useForm<Step2Form>();

  const parentForm = useForm<ParentForm>({
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  const schoolForm = useForm<SchoolForm>({
    defaultValues: {
      schoolType: "school",
      provideVenue: false,
      sports: [],
      password: '',
      confirmPassword: ''
    }
  });

  // Load available sports for school registration
  useEffect(() => {
    if (step === 3 && userRole === "school") {
      const fetchSports = async () => {
        try {
          const response = await getSignupSports();
          setAvailableSports(response.sports || []);
        } catch (error) {
          Sentry.captureException(error);
          console.error("Error fetching sports:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load available sports. Please try again."
          });
        }
      };

      fetchSports();
    }
  }, [step, userRole]);

  // Step 1: Submit email and role, request OTP
  const onSubmitStep1 = async (data: Step1Form) => {
    try {
      setLoading(true);
 
      const response = await requestSignupOTP(data.email);

      if (response.success) {
        setUserEmail(data.email);
        setUserRole(data.role);
        setStep(2);
        toast({
          title: "Success",
          description: "OTP sent to your email. Please check your inbox.",
        });
      }
    } catch (error) {
        Sentry.captureException(error);
      if(error.message === "Network Error") {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Internal server error",
        })
        return 
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send OTP. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const onSubmitStep2 = async (data: Step2Form) => {
    try {
      setLoading(true);
 
      const response = await verifySignupOTP(userEmail, data.otp);

      if (response.success) {
        setStep(3);
        toast({
          title: "Success",
          description: "OTP verified successfully. Please complete your registration.",
        });
      }
    } catch (error) {
        Sentry.captureException(error);
      console.error("Error verifying OTP:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to verify OTP. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Complete Parent Registration
  const onSubmitParent = async (data: ParentForm) => {
    try {
      setLoading(true);

      if (data.password !== data.confirmPassword) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Passwords do not match",
        });
        return;
      }

      const userData = {
        email: userEmail,
        role: userRole,
        name: data.name,
        countryCode: data.countryCode,
        phoneNumber: data.phoneNumber,
        password: data.password
      };

      const response = await completeSignup(userData);

      if (response.success) {
        toast({
          title: "Success",
          description: "Registration completed successfully. You can now login.",
        });
        navigate("/login");
      }
    } catch (error) {
        Sentry.captureException(error);
      console.error("Error completing parent registration:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to complete registration. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Complete School Registration
  const onSubmitSchool = async (data: SchoolForm) => {
    try {
      setLoading(true);

      if (data.password !== data.confirmPassword) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Passwords do not match",
        });
        return;
      }

      const userData = {
        email: userEmail,
        role: userRole,
        name: data.name,
        schoolType: data.schoolType,
        contactPersonName: data.contactPersonName,
        contactPersonPhone: data.contactPersonPhone,
        countryCode: data.countryCode,
        address: data.address,
        sports: data.sports,
        provideVenue: data.provideVenue,
        password: data.password
      };

      const response = await completeSignup(userData);

      if (response.success) {
        toast({
          title: "Success",
          description: "Registration completed successfully. You can now login.",
        });
        navigate("/login");
      }
    } catch (error) {
        Sentry.captureException(error);
      console.error("Error completing school registration:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to complete registration. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {step === 1 ? "Create an account" :
             step === 2 ? "Verify your email" :
             "Complete your profile"}
          </CardTitle>
          <CardDescription>
            {step === 1 ? "Enter your email to get started" :
             step === 2 ? "Enter the OTP sent to your email" :
             "Enter your details to complete registration"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1: Email and Role Selection */}
          {step === 1 && (
            <Form {...step1Form}>
              <form onSubmit={step1Form.handleSubmit(onSubmitStep1)} className="space-y-4">
                <FormField
                  control={step1Form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={step1Form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>I am a</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="school">School/Academy</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending OTP..." : "Continue"}
                </Button>
              </form>
            </Form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <Form {...step2Form}>
              <form onSubmit={step2Form.handleSubmit(onSubmitStep2)} className="space-y-4">
                <FormField
                  control={step2Form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OTP</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter the OTP sent to your email"
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
              </form>
            </Form>
          )}

          {/* Step 3: Parent Registration */}
          {step === 3 && userRole === "parent" && (
            <Form {...parentForm}>
              <form onSubmit={parentForm.handleSubmit(onSubmitParent)} className="space-y-4">
                <FormField
                  control={parentForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={parentForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <PhoneInput
                          country={'ae'}
                          value={field.value}
                          onChange={(phone, data) => {
                            field.onChange(phone);
                            const countryCode = data?.dialCode;
                            if (countryCode) {
                              parentForm.setValue('countryCode', `+${countryCode}`);
                            }
                          }}
                          inputClass="w-full p-2 border rounded"
                          containerClass="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={parentForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={parentForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm your password"
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <input
                  type="hidden"
                  {...parentForm.register('countryCode')}
                />
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    "Registering..."
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Complete Registration
                    </>
                  )}
                </Button>
              </form>
            </Form>
          )}

          {/* Step 3: School Registration */}
          {step === 3 && userRole === "school" && (
            <Form {...schoolForm}>
              <form onSubmit={schoolForm.handleSubmit(onSubmitSchool)} className="space-y-4">
                <FormField
                  control={schoolForm.control}
                  name="schoolType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="school">School</SelectItem>
                          <SelectItem value="academy">Academy</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={schoolForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School/Academy Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter school/academy name"
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={schoolForm.control}
                  name="contactPersonName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter contact person name"
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={schoolForm.control}
                  name="contactPersonPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person Phone</FormLabel>
                      <FormControl>
                        <PhoneInput
                          country={'ae'}
                          value={field.value}
                          onChange={(phone, data) => {
                            field.onChange(phone);
                            const countryCode = data?.dialCode;
                            if (countryCode) {
                              schoolForm.setValue('countryCode', `+${countryCode}`);
                            }
                          }}
                          inputClass="w-full p-2 border rounded"
                          containerClass="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <input
                  type="hidden"
                  {...schoolForm.register('countryCode')}
                />
                
                <FormField
                  control={schoolForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter address"
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={schoolForm.control}
                  name="sports"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sports Focus</FormLabel>
                      <div className="space-y-2">
                        {availableSports.map((sport) => (
                          <div key={sport._id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`sport-${sport._id}`}
                              checked={field.value.includes(sport._id)}
                              onCheckedChange={(checked) => {
                                const newValue = checked
                                  ? [...field.value, sport._id]
                                  : field.value.filter(id => id !== sport._id);
                                field.onChange(newValue);
                              }}
                            />
                            <label htmlFor={`sport-${sport._id}`}>{sport.name}</label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={schoolForm.control}
                  name="provideVenue"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Willing to provide venue
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={schoolForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={schoolForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm your password"
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    "Registering..."
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Complete Registration
                    </>
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            className="text-sm text-muted-foreground"
            onClick={() => navigate("/login")}
          >
            Already have an account? Sign in
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}