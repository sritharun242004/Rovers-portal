/**
 * CSV Export utility for handling file downloads
 */

export interface StudentRowData {
    row?: number;
    name?: string;
    uid?: string;
    dob?: string;
    gender?: string;
    nationality?: string;
    city?: string;
    represents?: string;
    class?: string;
    bloodGroup?: string;
    relationship?: string;
    medicalConditions?: string;
    sport?: string;
    distance?: string;
    sportSubType?: string;
    parentEmail?: string;
    parentName?: string;
    error?: string;
}

/**
 * Converts array of objects to CSV string
 */
export const convertToCSV = (data: StudentRowData[]): string => {
    if (!data || data.length === 0) return '';

    // Define the headers in the order they should appear
    const headers = [
        'Row Number',
        'Name *',
        'UID *',
        'DOB *',
        'Gender *',
        'Nationality',
        'City',
        'Represents',
        'Class',
        'Blood Group',
        'Relationship',
        'Medical Conditions',
        'Sport *',
        'Distance *',
        'Sport Sub Type',
        'Parent Email',
        'Parent Name',
        'Error Details'
    ];

    // Create CSV header row
    const csvHeader = headers.join(',');

    // Convert data rows to CSV format
    const csvRows = data.map(row => {
        const values = [
            row.row || '',
            `"${(row.name || '').replace(/"/g, '""')}"`,
            `"${(row.uid || '').replace(/"/g, '""')}"`,
            `"${(row.dob || '').replace(/"/g, '""')}"`,
            `"${(row.gender || '').replace(/"/g, '""')}"`,
            `"${(row.nationality || '').replace(/"/g, '""')}"`,
            `"${(row.city || '').replace(/"/g, '""')}"`,
            `"${(row.represents || '').replace(/"/g, '""')}"`,
            `"${(row.class || '').replace(/"/g, '""')}"`,
            `"${(row.bloodGroup || '').replace(/"/g, '""')}"`,
            `"${(row.relationship || '').replace(/"/g, '""')}"`,
            `"${(row.medicalConditions || '').replace(/"/g, '""')}"`,
            `"${(row.sport || '').replace(/"/g, '""')}"`,
            `"${(row.distance || '').replace(/"/g, '""')}"`,
            `"${(row.sportSubType || '').replace(/"/g, '""')}"`,
            `"${(row.parentEmail || '').replace(/"/g, '""')}"`,
            `"${(row.parentName || '').replace(/"/g, '""')}"`,
            `"${(row.error || '').replace(/"/g, '""')}"`
        ];
        return values.join(',');
    });

    return [csvHeader, ...csvRows].join('\n');
};

/**
 * Downloads CSV data as a file
 */
export const downloadCSV = (data: StudentRowData[], filename: string = 'invalid_students.csv'): void => {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up URL object
    URL.revokeObjectURL(url);
};

/**
 * Downloads invalid student rows with error details
 */
export const downloadInvalidRows = (errorRows: StudentRowData[]): void => {
    if (!errorRows || errorRows.length === 0) {
        console.warn('No error rows to download');
        return;
    }

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `invalid_students_${timestamp}.csv`;

    downloadCSV(errorRows, filename);
}; 