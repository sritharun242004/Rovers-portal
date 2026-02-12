import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useLocation } from "react-router-dom"
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
import { Lock, ArrowLeft, Eye, EyeOff } from "lucide-react"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

type SetupPasswordForm = {
  password: string;
  confirmPassword: string;
}

export function SetupPassword() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<SetupPasswordForm>()

  const onSubmit = async (data: SetupPasswordForm) => {
    try {
      if (!email) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Email is required",
        })
        return
      }

      setLoading(true)
      const response = await axios.post(`${API_URL}/api/auth/setup-password`, {
        email,
        password: data.password
      })

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Password setup successful",
        })
        navigate('/login')
      } else {
        throw new Error(response.data.message || "Failed to setup password")
      }
    } catch (error: any) {
      Sentry.captureException(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to setup password",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Error</CardTitle>
            <CardDescription>
              No email provided. Please go back to login.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate('/login')}>
              Back to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Setup Password</CardTitle>
          <CardDescription>
            Please set up your password to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="pr-10"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters"
                    }
                  })}
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
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  className="pr-10"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: value => value === watch("password") || "Passwords do not match"
                  })}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                "Setting up Password..."
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Setup Password
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            className="text-sm text-muted-foreground"
            onClick={() => navigate('/login')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 