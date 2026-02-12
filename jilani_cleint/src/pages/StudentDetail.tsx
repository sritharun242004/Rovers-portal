import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye } from "lucide-react";
import { format } from 'date-fns';
import { getStudentById } from '@/api/parent';
import { getParentRegistrations } from '@/api/registration';
import { useToast } from '@/hooks/useToast';
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function StudentDetail() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [idProofDialog, setIdProofDialog] = useState(false);
  const [paymentProofDialog, setPaymentProofDialog] = useState(false);
  const [paymentScreenshot, setPaymentScreenshot] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);
  const [registeredTogether, setRegisteredTogether] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state
        console.log('Fetching student data for studentId:', studentId);
        
        if (!studentId) {
          console.error('No studentId provided');
          setError('No student ID provided');
          setLoading(false);
          return;
        }
        
        const response = await getStudentById(studentId);
        console.log('Student data response:', response);
        
        if (response.success) {
          setStudent(response.student);
          
          // Fetch registrations to get payment screenshot
          try {
            const registrationsResponse = await getParentRegistrations();
            console.log('Registrations response:', registrationsResponse);
            if (registrationsResponse.success && registrationsResponse.registrations) {
              console.log('All registrations:', registrationsResponse.registrations);
              console.log('Looking for studentId:', studentId);
              
              // Find all registrations for this student with payment screenshot
              // Handle both string and ObjectId comparisons
              const studentRegistrations = registrationsResponse.registrations.filter(
                (reg: any) => {
                  const regStudentId = reg.student?._id?.toString() || reg.student?._id || reg.student;
                  const currentStudentId = studentId?.toString();
                  const matches = regStudentId === currentStudentId;
                  const hasScreenshot = reg.paymentScreenshot && reg.paymentScreenshot.trim() !== '';
                  
                  return matches && hasScreenshot;
                }
              );
              
              console.log('Found student registrations with payment screenshot:', studentRegistrations);
              
              // Get the most recent registration with payment screenshot
              if (studentRegistrations.length > 0) {
                // Sort by createdAt (most recent first) and get the first one
                const latestRegistration = studentRegistrations.sort((a: any, b: any) => {
                  const dateA = new Date(a.createdAt || 0).getTime();
                  const dateB = new Date(b.createdAt || 0).getTime();
                  return dateB - dateA;
                })[0];
                
                console.log('Latest Registration found with payment screenshot');
                console.log('Reference Number:', latestRegistration?.referenceNumber || 'Not set');
                
                if (latestRegistration?.paymentScreenshot) {
                  console.log('Setting payment screenshot from latest registration:', latestRegistration.paymentScreenshot);
                  setPaymentScreenshot(latestRegistration.paymentScreenshot);
                  
                  // Set reference number if available
                  if (latestRegistration?.referenceNumber) {
                    setReferenceNumber(latestRegistration.referenceNumber);
                  }
                  
                  // Find all other students who were registered with the same payment screenshot
                  const othersWithSamePayment = registrationsResponse.registrations.filter(
                    (reg: any) => {
                      const regStudentId = reg.student?._id?.toString() || reg.student?._id || reg.student;
                      const currentStudentId = studentId?.toString();
                      return (
                        reg.paymentScreenshot === latestRegistration.paymentScreenshot &&
                        regStudentId !== currentStudentId
                      );
                    }
                  );
                  console.log('Students registered together with same payment:', othersWithSamePayment);
                  setRegisteredTogether(othersWithSamePayment);
                }
              } else {
                console.log('No payment screenshot found for this student. All registrations:', registrationsResponse.registrations);
              }
            }
          } catch (regError) {
            console.error('Error fetching registrations:', regError);
            // Don't show error for registration fetch failure
          }
        } else {
          console.error('API returned success: false', response);
          const errorMsg = response.message || "Failed to load student details";
          setError(errorMsg);
          toast({
            variant: "destructive",
            title: "Error",
            description: errorMsg
          });
        }
      } catch (error: any) {
        console.error('Error fetching student data:', error);
        console.error('Error details:', {
          message: error?.message,
          response: error?.response?.data,
          status: error?.response?.status
        });
        
        const errorMsg = error?.response?.data?.message || error?.message || "Failed to load student details";
        setError(errorMsg);
        
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMsg
        });
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      console.log('useEffect triggered - fetching data for studentId:', studentId);
      fetchStudentData();
    } else {
      console.warn('No studentId provided to useEffect');
      setLoading(false);
    }
  }, [studentId, navigate, toast]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';

    try {
      const date = new Date(dateString);
      return format(date, "do MMMM yyyy");
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Debug: Log payment screenshot state
  console.log('🔍 Payment Screenshot State:', {
    hasScreenshot: !!paymentScreenshot,
    screenshotUrl: paymentScreenshot,
    registeredTogetherCount: registeredTogether.length
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Loading student details...</p>
        <p className="text-xs text-gray-400">Student ID: {studentId}</p>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          className="mb-4"
          onClick={() => navigate('/parent/students')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Students
        </Button>
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Student</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">
                {error || 'Student not found'}
              </p>
              <p className="text-sm text-red-600 mt-2">
                Student ID: {studentId}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setError(null);
                  setStudent(null);
                  setLoading(true);
                  // Retry
                  if (studentId) {
                    const fetchData = async () => {
                      try {
                        const response = await getStudentById(studentId);
                        if (response.success) {
                          setStudent(response.student);
                        }
                      } catch (e) {
                        console.error(e);
                      } finally {
                        setLoading(false);
                      }
                    };
                    fetchData();
                  }
                }}
                variant="outline"
              >
                Try Again
              </Button>
              <Button
                onClick={() => navigate('/parent/students')}
              >
                Go Back to Students
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        className="mb-4"
        onClick={() => navigate('/parent/students')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Students
      </Button>

      <Card className="overflow-hidden">
        <CardHeader className="pb-4 pt-6 px-6 bg-muted/20">
          <CardTitle className="text-2xl flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={student.photo} alt={student.name} />
              <AvatarFallback className="text-3xl">{student.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{student.name}</h2>
              <p className="text-sm text-muted-foreground">{student.sport?.name || 'No sport assigned'}</p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Personal Information Section - Combined */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-300">
              <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Information
              </h3>
              
              <div className="space-y-6">
                {/* Basic Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600 font-medium">Date of Birth</span>
                    <span className="text-base text-gray-900 mt-1">{formatDate(student.dob)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600 font-medium">Gender</span>
                    <span className="text-base text-gray-900 mt-1">{student.gender ? student.gender.charAt(0).toUpperCase() + student.gender.slice(1) : 'Not specified'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600 font-medium">Nationality</span>
                    <span className="text-base text-gray-900 mt-1">{student.nationality || 'Not specified'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600 font-medium">City</span>
                    <span className="text-base text-gray-900 mt-1">{student.city || 'Not specified'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600 font-medium">Nationality ID</span>
                    <span className="text-base text-gray-900 mt-1">{student.uid || 'Not specified'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600 font-medium">Aadhaar/UAE ID</span>
                    <div className="flex items-center gap-2 mt-1">
                      {student.idProof ? (
                        <>
                          <span className="text-green-600 font-medium">Uploaded</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIdProofDialog(true)}
                            className="h-7 text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </>
                      ) : (
                        <span className="text-gray-500">Not uploaded</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-blue-200"></div>

                {/* Academic Information */}
                <div>
                  <h4 className="text-lg font-semibold text-blue-900 mb-3">Academic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600 font-medium">School/Academy</span>
                      <span className="text-base text-gray-900 mt-1">{student.represents || 'Not specified'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600 font-medium">Class Studying</span>
                      <span className="text-base text-gray-900 mt-1">{student.class || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-blue-200"></div>

                {/* Medical Information */}
                <div>
                  <h4 className="text-lg font-semibold text-blue-900 mb-3">Medical Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600 font-medium">Blood Group</span>
                      <span className="text-base text-gray-900 mt-1">{student.bloodGroup || 'Not specified'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600 font-medium">Medical Conditions</span>
                      <span className="text-base text-gray-900 mt-1">{student.medicalConditions || 'None'}</span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-blue-200"></div>

                {/* Additional Information */}
                <div>
                  <h4 className="text-lg font-semibold text-blue-900 mb-3">Additional Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600 font-medium">Relationship to Athlete</span>
                      <span className="text-base text-gray-900 mt-1">{student.relationship || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Proof Section - Prominent Display */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-300">
              <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Payment Proof
              </h3>
              {paymentScreenshot ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-700 font-semibold text-lg">Payment Screenshot Uploaded</span>
              </div>

                  {/* Reference Number Display */}
                  {referenceNumber ? (
                    <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 font-medium mb-1">Payment Reference Number</p>
                          <p className="text-xl font-mono font-bold text-blue-900 tracking-wider">{referenceNumber}</p>
                        </div>
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                      <p className="text-sm text-yellow-700">
                        ℹ️ Reference number not available for this registration. This is expected for registrations made before the reference number field was added.
                      </p>
                    </div>
                  )}
                  
                  {/* Screenshot Preview */}
                  <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                      <div className="flex-1">
                        {paymentScreenshot.endsWith('.pdf') || paymentScreenshot.includes('.pdf') ? (
                          <div className="flex items-center gap-3">
                            <svg className="w-12 h-12 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
                              <path d="M14 2v6h6M9 13h6M9 17h6M9 9h1"/>
                            </svg>
                            <div>
                              <p className="font-medium text-gray-900">PDF Document</p>
                              <p className="text-sm text-gray-500">Click view to open</p>
                            </div>
                          </div>
                        ) : (
                          <img
                            src={paymentScreenshot}
                            alt="Payment Proof"
                            className="w-full max-w-xs h-48 object-cover rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setPaymentProofDialog(true)}
                          />
                        )}
                      </div>
                      <Button
                        onClick={() => setPaymentProofDialog(true)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Full Size
                      </Button>
                    </div>
                    {registeredTogether.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-green-200">
                        <p className="text-sm text-green-700">
                          <span className="font-semibold">Group Payment:</span> This payment was made for {registeredTogether.length + 1} student{registeredTogether.length > 0 ? 's' : ''} together
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-gray-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-base">No payment proof uploaded yet</span>
                </div>
              )}
            </div>

          </div>
        </CardContent>
      </Card>

      {/* ID Proof Dialog */}
      <Dialog open={idProofDialog} onOpenChange={setIdProofDialog}>
        <DialogContent className="max-w-3xl">
          {student.idProof && (
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-xl font-bold mb-4">ID Document</h2>
              {student.idProof.endsWith('.pdf') ? (
                <embed
                  src={student.idProof}
                  type="application/pdf"
                  width="100%"
                  height="500px"
                />
              ) : (
                <img
                  src={student.idProof}
                  alt="ID Proof"
                  className="max-h-[70vh] object-contain"
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Proof Dialog */}
      <Dialog open={paymentProofDialog} onOpenChange={setPaymentProofDialog}>
        <DialogContent className="max-w-3xl">
          {paymentScreenshot && (
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-xl font-bold mb-4">Payment Proof</h2>
              {paymentScreenshot.endsWith('.pdf') || paymentScreenshot.includes('.pdf') ? (
                <embed
                  src={paymentScreenshot}
                  type="application/pdf"
                  width="100%"
                  height="500px"
                />
              ) : (
                <img
                  src={paymentScreenshot}
                  alt="Payment Proof"
                  className="max-h-[70vh] object-contain"
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}