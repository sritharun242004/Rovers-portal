import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { UserPlus, Phone, Mail } from "lucide-react";
import { registerVolunteer } from "@/api/volunteer";

type RegisterForm = {
  name: string;
  email: string;
  mobile: string;
  password: string;
  checkpoint: string;
};

export function VolunteerRegister() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    try {
      setLoading(true);
      console.log(data,"voulnteer data")
      await registerVolunteer(data);
      toast({
        title: "Success",
        description: "Volunteer registered successfully",
      });
      navigate("/volunteers");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to register volunteer",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Register New Volunteer</CardTitle>
          <CardDescription>Add a new volunteer to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...register("name", { required: true })}
                placeholder="Enter full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { required: true })}
                placeholder="Enter email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                {...register("mobile", { required: true })}
                placeholder="Enter mobile number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkpoint">Checkpoint</Label>
              <Select 
                onValueChange={(value) => setValue('checkpoint', value)}
                required
              >
                <SelectTrigger id="checkpoint">
                  <SelectValue placeholder="Select checkpoint" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Checkpoint 1">Checkpoint 1</SelectItem>
                  <SelectItem value="Checkpoint 2">Checkpoint 2</SelectItem>
                  <SelectItem value="Checkpoint 3">Checkpoint 3</SelectItem>
                </SelectContent>
              </Select>
              <input
                type="hidden"
                {...register('checkpoint', { required: 'Checkpoint is required' })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password", { required: true })}
                placeholder="Enter password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                "Registering..."
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register Volunteer
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}