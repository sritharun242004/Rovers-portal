import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/useToast';
import { submitQuery } from '@/api/support';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type FormValues = {
  queryType?: string;
  subject: string;
  details: string;
  studentId?: string;
};

const queryTypes = [
  'Account Issue',
  'Registration Problem',
  'Student Profile',
  'Payment Issue',
  'Technical Support',
  'General Inquiry',
  'Other'
];

export function QueryRaisingForm({ students = [], onSuccess }) {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const watchQueryType = watch('queryType');
  const [isStudentRelated, setIsStudentRelated] = useState(false);

  useEffect(() => {
    if (watchQueryType) {
      // Determine if the query type is related to students
      const studentRelatedQueries = ['Student Profile', 'Registration Problem'];
      setIsStudentRelated(studentRelatedQueries.includes(watchQueryType));
    }
  }, [watchQueryType]);

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);


      // Set a default query type
      data.queryType = 'General';

      // Use the updated submitQuery function
      const response = await submitQuery(data);
      toast({
        title: "Success",
        description: "Your query has been submitted successfully. We will get back to you soon."
      });

      reset();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting query:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit your query. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Raise a Query</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="query-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Student Selection (only shows if query is student-related) */}
          {isStudentRelated && students.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="studentId">Related Student *</Label>
              <Select onValueChange={(value) => setValue('studentId', value)} defaultValue="">
                <SelectTrigger id="studentId">
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student._id} value={student._id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.studentId && <p className="text-sm text-red-500">{errors.studentId.message}</p>}
            </div>
          )}

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              {...register('subject', { required: 'Subject is required' })}
              placeholder="Enter query subject"
            />
            {errors.subject && <p className="text-sm text-red-500">{errors.subject.message}</p>}
          </div>

          {/* Details */}
          <div className="space-y-2">
            <Label htmlFor="details">Details *</Label>
            <Textarea
              id="details"
              {...register('details', {
                required: 'Details are required',
                minLength: {
                  value: 10,
                  message: 'Please provide more details (at least 10 characters)'
                }
              })}
              placeholder="Please provide detailed information about your query"
              rows={5}
            />
            {errors.details && <p className="text-sm text-red-500">{errors.details.message}</p>}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          form="query-form"
          type="submit"
          disabled={loading}
          className="w-full md:w-auto"
        >
          {loading ? "Submitting..." : "Submit Query"}
        </Button>
      </CardFooter>
    </Card>
  );
}