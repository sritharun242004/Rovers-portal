import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Upload,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  AlertCircle,
  Download
} from 'lucide-react';
import { downloadInvalidRows, type StudentRowData } from '@/utils/csvExport';

interface BulkUploadPreviewProps {
  data: {
    validRows: any[];
    errors: any[];
    totalRows: number;
  };
  onBack: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export function BulkUploadPreview({
  data,
  onBack,
  onConfirm,
  onCancel,
  loading
}: BulkUploadPreviewProps) {
  const [activeTab, setActiveTab] = useState('valid');

  const { validRows, errors, totalRows } = data;
  const validCount = validRows.length;
  const errorCount = errors.length;

  // Debug: Log the data structure
  console.log('BulkUploadPreview data:', data);
  console.log('Valid rows sample:', validRows.slice(0, 2));
  console.log('Error rows sample:', errors.slice(0, 2));

  const handleDownloadErrors = () => {
    if (errors && errors.length > 0) {
      downloadInvalidRows(errors as StudentRowData[]);
    }
  };

  const getRowStatusIcon = (hasErrors: boolean) => {
    return hasErrors ? (
      <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
    ) : (
      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
    );
  };

  const renderStudentRow = (student: any, index: number, isError: boolean = false) => {
    // Debug: Log individual student data
    if (index < 3) { // Only log first 3 rows to avoid spam
      console.log(`Rendering student row ${index}:`, student);
      console.log(`Student DOB:`, student.dob, typeof student.dob);
    }

    return (
      <tr key={index} className={`${isError ? 'bg-red-50 border-red-200' : 'bg-white hover:bg-gray-50'} border-b transition-colors`}>
        <td className="px-2 py-3 text-sm w-16 sticky left-0 bg-inherit border-r">
          <div className="flex items-center gap-2">
            {getRowStatusIcon(isError)}
            <span className="font-medium">{isError ? student.row : index + 1}</span>
          </div>
        </td>
        <td className="px-3 py-3 text-sm min-w-[120px] max-w-[150px]">
          <div className="font-medium text-gray-900 truncate" title={student.name}>
            {student.name || 'N/A'}
          </div>
        </td>
        <td className="px-3 py-3 text-sm min-w-[100px] max-w-[120px]">
          <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded truncate" title={student.uid}>
            {student.uid || 'N/A'}
          </div>
        </td>
        <td className="px-3 py-3 text-sm min-w-[100px] max-w-[120px]">
          <div className="truncate" title={student.dob}>
            {student.dob || 'N/A'}
          </div>
        </td>
        <td className="px-3 py-3 text-sm min-w-[80px] max-w-[100px]">
          <div className="truncate" title={student.gender}>
            {student.gender || 'N/A'}
          </div>
        </td>
        <td className="px-3 py-3 text-sm min-w-[100px] max-w-[120px]">
          <div className="truncate" title={student.nationality}>
            {student.nationality || 'N/A'}
          </div>
        </td>
        <td className="px-3 py-3 text-sm min-w-[100px] max-w-[120px]">
          <div className="truncate" title={student.city}>
            {student.city || 'N/A'}
          </div>
        </td>
        <td className="px-3 py-3 text-sm min-w-[80px] max-w-[100px]">
          <div className="truncate" title={student.class}>
            {student.class || 'N/A'}
          </div>
        </td>
        <td className="px-3 py-3 text-sm min-w-[80px] max-w-[100px]">
          <div className="truncate" title={student.bloodGroup}>
            {student.bloodGroup || 'N/A'}
          </div>
        </td>
        <td className="px-3 py-3 text-sm min-w-[100px] max-w-[120px]">
          <div className="truncate" title={student.relationship}>
            {student.relationship || 'N/A'}
          </div>
        </td>
        <td className="px-3 py-3 text-sm min-w-[120px] max-w-[150px]">
          <div className="truncate" title={student.sport}>
            {student.sport || 'N/A'}
          </div>
        </td>
        <td className="px-3 py-3 text-sm min-w-[100px] max-w-[120px]">
          <div className="truncate" title={student.distance}>
            {student.distance || 'N/A'}
          </div>
        </td>
        <td className="px-3 py-3 text-sm min-w-[120px] max-w-[150px]">
          <div className="truncate" title={student.sportSubType}>
            {student.sportSubType || 'N/A'}
          </div>
        </td>
        <td className="px-3 py-3 text-sm min-w-[150px] max-w-[200px]">
          <div className="truncate" title={student.parentEmail}>
            {student.parentEmail || 'N/A'}
          </div>
        </td>
        <td className="px-3 py-3 text-sm min-w-[120px] max-w-[150px]">
          <div className="truncate" title={student.parentName}>
            {student.parentName || 'N/A'}
          </div>
        </td>
        {isError && (
          <td className="px-3 py-3 text-sm min-w-[200px] max-w-[300px]">
            <div className="text-red-600 text-xs p-2 bg-red-50 rounded border border-red-200">
              <div className="font-medium text-red-800 mb-1">Error:</div>
              <div className="break-words">{student.error}</div>
            </div>
          </td>
        )}
      </tr>
    );
  };

  const renderDataTable = (rows: any[], showErrors: boolean = false) => {
    return (
      <div className="border rounded-lg bg-white shadow-sm relative">
        <div className="overflow-auto h-[400px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <table className="w-full border-collapse min-w-[1400px]">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-r sticky left-0 bg-gray-50 z-20 w-16">
                  <div className="flex items-center gap-1">
                    <span>#</span>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b min-w-[120px]">
                  Name
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b min-w-[100px]">
                  UID
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b min-w-[100px]">
                  DOB
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b min-w-[80px]">
                  Gender
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b min-w-[100px]">
                  Nationality
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b min-w-[100px]">
                  City
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b min-w-[80px]">
                  Class
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b min-w-[80px]">
                  Blood Group
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b min-w-[100px]">
                  Relationship
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b min-w-[120px]">
                  Sport
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b min-w-[100px]">
                  Distance
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b min-w-[120px]">
                  Sub Type
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b min-w-[150px]">
                  Parent Email
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b min-w-[120px]">
                  Parent Name
                </th>
                {showErrors && (
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b min-w-[200px]">
                    Error Details
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.length > 0 ? (
                rows.map((row, index) => renderStudentRow(row, index, showErrors))
              ) : (
                <tr>
                  <td colSpan={showErrors ? 16 : 15} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="h-8 w-8 text-gray-400" />
                      <p>No data to display</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {rows.length > 0 && (
          <div className="bg-gray-50 px-4 py-2 border-t flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {rows.length} {rows.length === 1 ? 'row' : 'rows'}
              {showErrors && ' with errors'}
            </p>
            <p className="text-xs text-gray-500">
              ← → Scroll to view all columns
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Review Student Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Total Rows</p>
                <p className="text-2xl font-bold text-blue-600">{totalRows}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">Valid Rows</p>
                <p className="text-2xl font-bold text-green-600">{validCount}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-800">Invalid Rows</p>
                <p className="text-2xl font-bold text-red-600">{errorCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {errorCount > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {errorCount} rows have validation errors. Only valid rows will be uploaded.
              Please review the errors in the "Invalid Rows" tab and download the error rows to correct them.
            </AlertDescription>
          </Alert>
        )}

        {validCount > 0 && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              {validCount} students are ready to be uploaded. Review the data below and click "Confirm Upload" to proceed.
            </AlertDescription>
          </Alert>
        )}

        {/* Data Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="valid" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Valid Rows ({validCount})
            </TabsTrigger>
            <TabsTrigger value="errors" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Invalid Rows ({errorCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="valid" className="mt-2">
            {validCount > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Valid Students</h3>
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    {validCount} ready for upload
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded border border-blue-200">
                  <p>💡 <strong>Tip:</strong> The table below is scrollable both horizontally and vertically. Use your mouse or trackpad to scroll through all student data.</p>
                </div>
                {renderDataTable(validRows)}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <XCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Valid Rows Found</h3>
                <p className="text-gray-600">Please check your data and try again.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="errors" className="mt-2">
            {errorCount > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Invalid Students</h3>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-800 border-red-300">
                      {errorCount} errors found
                    </Badge>
                    <Button
                      onClick={handleDownloadErrors}
                      size="sm"
                      variant="outline"
                      className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download Errors
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-gray-600 bg-red-50 p-2 rounded border border-red-200">
                  <p>💡 <strong>Tip:</strong> The table below shows validation errors. It's scrollable both horizontally and vertically to view all error details. You can download the error rows as a CSV file to correct them and re-upload.</p>
                </div>
                {renderDataTable(errors, true)}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Errors Found</h3>
                <p className="text-gray-600">All rows are valid and ready for upload!</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-3">
        <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to File Selection
        </Button>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading || validCount === 0}
            className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
          >
            {loading ? (
              "Uploading..."
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Confirm Upload ({validCount} students)
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 