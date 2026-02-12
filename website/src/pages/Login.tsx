import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import * as Sentry from "@sentry/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { useToast } from "@/hooks/useToast"
import { LogIn, Mail, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import axios from "axios"

// URL of the logo image
const LOGO_IMAGE_URL = "https://postactionsbucket.s3.ap-south-1.amazonaws.com/rovers+logo.png"
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

type LoginForm = {
  email: string;
  password?: string;
}

type OtpForm = {
  otp: string;
}

type ApiResponse = {
  success: boolean;
  message?: string;
  role?: string;
  checkpoint?: string;
  hasPassword?: boolean;
  user?: {
    role: string;
    checkpoint: string;
    email: string;
  };
}

export function Login() {
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [email, setEmail] = useState("")
  const [loginMethod, setLoginMethod] = useState<'otp' | 'password'>('otp')
  const [isEmailValidated, setIsEmailValidated] = useState(false)
  const [needsPasswordSetup, setNeedsPasswordSetup] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()
  const { login, verifyOTP } = useAuth()
  const navigate = useNavigate()

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors }
  } = useForm<LoginForm>()

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: otpErrors },
    reset: resetOtp
  } = useForm<OtpForm>()

  const validateEmail = async (email: string) => {
    try {
      setLoading(true)
      const response = await axios.post(`${API_URL}/api/auth/validate-email`, { email });
      const responseData = response.data as ApiResponse;
      console.log('Validation response:', responseData);
      
      if (responseData.success) {
        setIsEmailValidated(true)
        setEmail(email)
        
        // Check if user needs to set up password
        if (!responseData.hasPassword) {
          setNeedsPasswordSetup(true)
          navigate('/setup-password', { state: { email } })
          return
        }

        toast({
          title: "Success",
          description: "Email validated successfully",
        })
      } else {
        throw new Error(responseData.message || 'Invalid email')
      }
    } catch (error: any) {
      console.error('Validation error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || error.message || "Invalid email",
      })
    } finally {
      setLoading(false)
    }
  }

  const onSubmitEmail = async (data: LoginForm) => {
    try {
      if (!isEmailValidated) {
        await validateEmail(data.email)
        return
      }

      setLoading(true)
      
      if (loginMethod === 'otp') {
        const response = await login(data.email)
        if (response.requireOTP) {
          setOtpSent(true)
          resetOtp({ otp: "" })

          toast({
            title: "Success",
            description: "OTP sent to your email",
          })
        }
      } else {
        // Handle password login
        const response = await login(data.email, data.password)
        if (response.success && response.user) {
          toast({
            title: "Success",
            description: "Logged in successfully",
          })
          handleSuccessfulLogin(response.user)
        } else {
          throw new Error(response.message || "Login failed")
        }
      }
    } catch (error: any) {
      Sentry.captureException(error);
      if (error.message === "Network Error") {
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
        description: error?.message || "Login failed",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSuccessfulLogin = (user: any) => {
    if (!user || !user.role) {
      console.error("Invalid user data:", user);
      navigate("/login");
      return;
    }

    switch (user.role) {
      case 'manager':
        navigate("/live");
        break;
      case 'volunteer':
        navigate("/volunteer");
        break;
      case 'parent':
        navigate("/parent");
        break;
      case 'school':
        navigate("/parent");
        break;
      default:
        console.warn("Unknown role:", user.role);
        navigate("/login");
    }
  }

  const onSubmitOtp = async (data: OtpForm) => {
    try {
      setLoading(true)
      const response = await verifyOTP(email, data.otp) as ApiResponse
      if (response.success) {
        toast({
          title: "Success",
          description: "Logged in successfully",
        })
        // Create a user object from the response data
        const userData = {
          role: response.role || response.user?.role || 'parent',
          checkpoint: response.checkpoint || response.user?.checkpoint || 'start',
          email: email
        }
        handleSuccessfulLogin(userData)
      } else {
        throw new Error(response.message || "OTP verification failed")
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "OTP verification failed",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img
              src={LOGO_IMAGE_URL}
              alt="Rovers Logo"
              className="h-20 w-auto"
            />
          </div>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            {otpSent
              ? "Enter the OTP sent to your email. Check your spam folder if not found in Inbox."
              : isEmailValidated
              ? "Choose your login method"
              : "Enter your email to continue"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!otpSent ? (
            <form onSubmit={handleSubmitEmail(onSubmitEmail)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...registerEmail("email", { required: "Email is required" })}
                  disabled={isEmailValidated}
                />
                {emailErrors.email && (
                  <p className="text-sm text-red-500">{emailErrors.email.message}</p>
                )}
              </div>

              {isEmailValidated && (
                <div className="flex items-center space-x-2 mb-4">
                  <RadioGroup
                    value={loginMethod}
                    onValueChange={(value) => setLoginMethod(value as 'otp' | 'password')}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="otp" id="otp" />
                      <Label htmlFor="otp">Login with OTP</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="password" id="password" />
                      <Label htmlFor="password">Login with Password</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {isEmailValidated && loginMethod === 'password' && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pr-10"
                      {...registerEmail("password", { required: "Password is required" })}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {emailErrors.password && (
                    <p className="text-sm text-red-500">{emailErrors.password.message}</p>
                  )}
                  <Button
                    type="button"
                    variant="link"
                    className="px-0 text-sm text-muted-foreground"
                    onClick={() => navigate('/forgot-password', { state: { email } })}
                  >
                    Forgot Password?
                  </Button>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    {!isEmailValidated ? 'Validate Email' : loginMethod === 'otp' ? 'Send Login Code' : 'Login'}
                  </>
                )}
              </Button>

              {isEmailValidated && (
                <Button
                  type="button"
                  variant="link"
                  className="w-full"
                  onClick={() => setIsEmailValidated(false)}
                >
                  Use different email
                </Button>
              )}
            </form>
          ) : (
            <form onSubmit={handleSubmitOtp(onSubmitOtp)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder=""
                  {...registerOtp("otp", {
                    required: "OTP is required",
                    pattern: {
                      value: /^\d{6}$/,
                      message: "OTP must be 6 digits"
                    }
                  })}
                />
                {otpErrors.otp && (
                  <p className="text-sm text-red-500">{otpErrors.otp.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  "Verifying..."
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Verify & Login
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="link"
                className="w-full mt-2"
                onClick={() => setOtpSent(false)}
              >
                Back
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-base">
            <span className="font-semibold">Don't have an account?</span>{" "}
            <Button
              variant="link"
              className="px-1 text-blue-600 underline text-base"
              onClick={() => navigate("/register")}
            >
              Register here
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}