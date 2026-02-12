import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { useToast } from '@/hooks/useToast';
import { parseStudentFile, bulkUploadStudents } from '@/api/parent';
import { Upload, Download, AlertCircle, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BulkUploadPreview } from './BulkUploadPreview';
import * as XLSX from 'xlsx';

interface BulkUploadStudentsProps {
  onSuccess: () => void;
  onCancel: () => void;
}

type UploadStep = 'file-selection' | 'preview' | 'complete';

export function BulkUploadStudents({ onSuccess, onCancel }: BulkUploadStudentsProps) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState<UploadStep>('file-selection');
  const [previewData, setPreviewData] = useState<any>(null);
  const [uploadResults, setUploadResults] = useState<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];

      if (!validTypes.includes(selectedFile.type)) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please upload a valid Excel file (.xlsx, .xls) or CSV file"
        });
        e.target.value = '';
        return;
      }

      setFile(selectedFile);
      setPreviewData(null);
      setUploadResults(null);
      setCurrentStep('file-selection');
    }
  };

  const handlePreview = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a file first"
      });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await parseStudentFile(formData);

      if (response.success) {
        setPreviewData(response.data);
        setCurrentStep('preview');

        if (response.data.errors && response.data.errors.length > 0) {
          toast({
            variant: "destructive",
            title: "Validation Issues Found",
            description: `${response.data.errors.length} rows have validation errors. Please review before proceeding.`
          });
        } else {
          toast({
            title: "File Parsed Successfully",
            description: `${response.data.validRows.length} students ready to upload`
          });
        }
      }
    } catch (error: any) {
      console.error('File parsing error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to parse file"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmUpload = async () => {
    if (!previewData || !file) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No data to upload"
      });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('confirmedData', JSON.stringify(previewData.validRows));

      const response = await bulkUploadStudents(formData);

      if (response.success) {
        setUploadResults(response.results);
        setCurrentStep('complete');

        if (response.results.errors && response.results.errors.length > 0) {
          toast({
            variant: "destructive",
            title: "Partial Success",
            description: `${response.results.successCount} students uploaded successfully, ${response.results.errors.length} failed`
          });
        } else {
          toast({
            title: "Success",
            description: `${response.results.successCount} students uploaded successfully`
          });
          setTimeout(() => onSuccess(), 2000);
        }
      }
    } catch (error: any) {
      console.error('Bulk upload error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to upload students"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToFileSelection = () => {
    setCurrentStep('file-selection');
    setPreviewData(null);
  };

  const handleStartOver = () => {
    setCurrentStep('file-selection');
    setPreviewData(null);
    setUploadResults(null);
    setFile(null);
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };

  // Download sample sheet with multiple sheets
  const handleDownloadSample = () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Template with instructions
    const templateData = [
      Object.fromEntries(sampleColumns.map(col => [col.key, col.label + (col.required ? ' *' : '')]))
    ];
    // Add a second row with instructions for special columns
    const instructionRow = Object.fromEntries(sampleColumns.map(col => [col.key, col.instructions || '']));
    templateData.push(instructionRow);
    // Add a third row as an example
    templateData.push({
      name: 'John Doe',
      uid: 'STU123',
      dob: '10-May-2012',
      gender: 'male',
      nationality: 'Indian',
      city: 'Mumbai',
      represents: '',
      class: 'Grade 5',
      bloodGroup: 'O+',
      relationship: 'father',
      medicalConditions: '',
      sport: 'Running',
      distance: '100m',
      sportSubType: 'Sprint',
      parentEmail: 'parent@example.com',
      parentName: 'John Doe Sr.'
    });

    // Add a fourth row as an example without distance (for sports that don't require it)
    templateData.push({
      name: 'Jane Smith',
      uid: 'STU124',
      dob: '15-Jun-2011',
      gender: 'female',
      nationality: 'Indian',
      city: 'Delhi',
      represents: '',
      class: 'Grade 6',
      bloodGroup: 'A+',
      relationship: 'mother',
      medicalConditions: '',
      sport: 'Karate',
      distance: '', // No distance required for Karate
      sportSubType: 'Kata',
      parentEmail: 'jane.parent@example.com',
      parentName: 'Jane Smith Sr.'
    });
    const ws1 = XLSX.utils.json_to_sheet(templateData, { skipHeader: true });
    XLSX.utils.book_append_sheet(wb, ws1, 'Template');

    // Sheet 2: Reference Data
    const referenceData = [
      { category: 'Sports', name: 'Running', description: 'Track and field running events' },
      { category: 'Sports', name: 'Swimming', description: 'Aquatic sports' },
      { category: 'Sports', name: 'Cricket', description: 'Team sport with bat and ball' },
      { category: 'Sports', name: 'Football', description: 'Team sport with ball' },
      { category: 'Sports', name: 'Basketball', description: 'Team sport with hoop' },
      { category: 'Sports', name: 'Karate', description: 'Martial art - no distances required' },
      { category: 'Sports', name: 'Taekwondo', description: 'Martial art - no distances required' },
      { category: '', name: '', description: '' },
      { category: 'Distances', name: '100m', description: 'Sprint distance' },
      { category: 'Distances', name: '200m', description: 'Short distance' },
      { category: 'Distances', name: '400m', description: 'Medium distance' },
      { category: 'Distances', name: '800m', description: 'Middle distance' },
      { category: 'Distances', name: '1500m', description: 'Long distance' },
      { category: '', name: '', description: '' },
      { category: 'Sport Sub Types', name: 'Sprint', description: 'Short distance running' },
      { category: 'Sport Sub Types', name: 'Marathon', description: 'Long distance running' },
      { category: 'Sport Sub Types', name: 'Freestyle', description: 'Swimming style' },
      { category: 'Sport Sub Types', name: 'Butterfly', description: 'Swimming style' },
      { category: 'Sport Sub Types', name: 'Backstroke', description: 'Swimming style' },
      { category: 'Sport Sub Types', name: 'Breaststroke', description: 'Swimming style' }
    ];
    const ws2 = XLSX.utils.json_to_sheet(referenceData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Reference Data');

    XLSX.writeFile(wb, 'bulk_upload_template.xlsx');
  };

  // Sample columns for bulk upload
  const sampleColumns = [
    { key: 'name', label: 'Name', required: true },
    { key: 'uid', label: 'UID', required: true },
    { key: 'dob', label: 'Date of Birth (DD-MMM-YYYY)', required: true },
    { key: 'gender', label: 'Gender (male/female/other)', required: true },
    { key: 'nationality', label: 'Nationality', required: false },
    { key: 'city', label: 'City', required: false },
    { key: 'represents', label: 'Represents', required: false },
    { key: 'class', label: 'Class', required: false },
    { key: 'bloodGroup', label: 'Blood Group', required: false },
    { key: 'relationship', label: 'Relationship', required: false },
    { key: 'medicalConditions', label: 'Medical Conditions', required: false },
    { key: 'sport', label: 'Sport', required: true, instructions: 'Use exact sport name from Reference Data sheet' },
    { key: 'distance', label: 'Distance', required: false, instructions: 'Use exact distance from Reference Data sheet. Only required for sports that have distances linked to them' },
    { key: 'sportSubType', label: 'Sport Sub Type', required: false, instructions: 'Use exact sub type from Reference Data sheet. Leave blank if not applicable' },
    { key: 'parentEmail', label: 'Parent Email', required: false, instructions: 'Required when school is adding students' },
    { key: 'parentName', label: 'Parent Name', required: false, instructions: 'Required when school is adding students' }
  ];

  if (currentStep === 'preview') {
    return (
      <BulkUploadPreview
        data={previewData}
        onBack={handleBackToFileSelection}
        onConfirm={handleConfirmUpload}
        onCancel={onCancel}
        loading={loading}
      />
    );
  }

  if (currentStep === 'complete') {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Upload Complete
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <h4 className="font-semibold mb-2 text-green-800">Upload Results:</h4>
            <p className="text-sm text-green-700">
              Successfully uploaded: {uploadResults.successCount} students
            </p>
            {uploadResults.errors && uploadResults.errors.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-red-600">
                  Failed: {uploadResults.errors.length} students
                </p>
                <div className="mt-2 max-h-32 overflow-y-auto">
                  {uploadResults.errors.map((error: any, index: number) => (
                    <p key={index} className="text-xs text-red-500">
                      Row {error.row}: {error.error}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleStartOver}>
            Upload Another File
          </Button>
          <Button onClick={onSuccess}>
            Done
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Bulk Upload Students</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Upload an Excel file (.xlsx, .xls) or CSV file with student information.
            Download the template to see the required format.
          </AlertDescription>
        </Alert>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">📋 Template includes:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Sheet 1:</strong> Template with instructions and example data</li>
            <li>• <strong>Sheet 2:</strong> Reference data with available Sports, Distances, and Sub Types</li>
            <li>• <strong>Tip:</strong> Copy values from the Reference Data sheet to avoid errors</li>
          </ul>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleDownloadSample}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Template
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="file">Select File</Label>
          <Input
            id="file"
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            ref={fileRef}
          />
          {file && (
            <p className="text-sm text-muted-foreground">
              Selected: {file.name}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handlePreview} disabled={loading || !file}>
          {loading ? (
            "Parsing..."
          ) : (
            <>
              <Eye className="mr-2 h-4 w-4" />
              Preview Data
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
} 