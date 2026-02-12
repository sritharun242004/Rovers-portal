import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    ArrowLeft,
    Search,
    Filter,
    Users,
    UserCheck,
    Calendar,
    MapPin,
    GraduationCap,
    Target,
    CheckCircle,
    AlertCircle,
    Loader2,
    UserPlus
} from 'lucide-react';
import { getFilterableStudents, getStudentFilterOptions, getSportDetails } from '@/api/students';
import { registerStudentForSport, notifyParentsForPayment, bulkRegisterStudents } from '@/api/registration';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/contexts/AuthContext';
// Payment components removed - payment gateways disabled
// import PaymentModal from '@/components/PaymentModal';
// import PaymentChoiceModal from '@/components/PaymentChoiceModal';
// import BankTransferPayment from '@/components/BankTransferPayment';
import RegistrationPaymentModal from '@/components/RegistrationPaymentModal';

interface Student {
    _id: string;
    name: string;
    uid: string;
    dob: string;
    gender: string;
    nationality: string;
    city: string;
    represents: string;
    class: string;
    bloodGroup: string;
    relationship: string;
    medicalConditions: string;
    sport: { _id: string; name: string };
    distance: { _id: string; category: string };
    sportSubType: { _id: string; type: string };
    ageCategory: { _id: string; ageGroup: string };
    isRegistered: boolean;
    age: number;
}

interface FilterOptions {
    sports: Array<{ _id: string; name: string }>;
    distances: Array<{ _id: string; category: string }>;
    sportSubTypes: Array<{ _id: string; type: string }>;
    ageCategories: Array<{ _id: string; ageGroup: string }>;
}

export function StudentSelection() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { toast } = useToast();
    const { userRole } = useAuth();

    // Get sport info from URL params
    const sportId = searchParams.get('sportId');
    const sportName = searchParams.get('sportName');
    const country = searchParams.get('country') || 'malaysia';

    // If no eventId from URL params, we're coming from home page sports
    const isFromHomePage = !eventId;

    // State management
    const [students, setStudents] = useState<Student[]>([]);
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        sports: [],
        distances: [],
        sportSubTypes: [],
        ageCategories: []
    });
    const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
    // Payment modals removed - payment gateways disabled
    // const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    // const [paymentChoiceModalOpen, setPaymentChoiceModalOpen] = useState(false);
    // const [bankTransferModalOpen, setBankTransferModalOpen] = useState(false);
    // const [paymentAmount, setPaymentAmount] = useState(0);
    // const [paymentCurrency, setPaymentCurrency] = useState('MYR');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalStudents: 0,
        hasNext: false,
        hasPrev: false
    });

    // Filter states
    const [filters, setFilters] = useState({
        sportId: sportId || '',
        sportSubTypeId: '',
        ageCategoryId: '',
        distanceId: '',
        search: '',
        page: 1,
        limit: 20
    });

    // Early validation for required URL parameters
    useEffect(() => {
        console.log('StudentSelection - URL Params Check:', { sportId, eventId, sportName, country });
        if (!sportId) {
            console.warn('Missing sportId in URL params');
            toast({
                variant: "destructive",
                title: "Missing Sport Information",
                description: "Sport ID is required. Redirecting to dashboard..."
            });
            
            // Redirect back to appropriate dashboard after showing error
            setTimeout(() => {
                if (eventId) {
                    navigate(`/event/${eventId}`);
                } else {
                    navigate('/parent');
                }
            }, 2000);
            return;
        }
    }, [sportId, eventId, navigate, toast, sportName, country]);

    // Load filter options on mount
    useEffect(() => {
        const loadFilterOptions = async () => {
            try {
                if (sportId) {
                    // If a specific sport is selected, get sport-specific filter options
                    const [generalResponse, sportResponse] = await Promise.all([
                        getStudentFilterOptions(),
                        getSportDetails(sportId)
                    ]);

                    if (sportResponse.success) {
                        // Use sport-specific filters
                        const selectedSport = generalResponse.filterOptions?.sports?.find(s => s._id === sportId);
                        const validatedOptions = {
                            sports: selectedSport ? [selectedSport] : [], // Only show the selected sport
                            distances: Array.isArray(sportResponse.sport.distances)
                                ? sportResponse.sport.distances.filter(item => item && item._id && item.category)
                                : [],
                            sportSubTypes: Array.isArray(sportResponse.sport.sportSubTypes)
                                ? sportResponse.sport.sportSubTypes.filter(item => item && item._id && item.type)
                                : [],
                            ageCategories: Array.isArray(sportResponse.sport.ageCategories)
                                ? sportResponse.sport.ageCategories.filter(item => item && item._id && item.ageGroup)
                                : []
                        };
                        setFilterOptions(validatedOptions);
                    } else {
                        throw new Error('Failed to load sport-specific options');
                    }
                } else {
                    // Load all filter options when no specific sport is selected
                    const response = await getStudentFilterOptions();

                    // Ensure the response has the expected structure
                    const filterOptions = response.filterOptions || {
                        sports: [],
                        distances: [],
                        sportSubTypes: [],
                        ageCategories: []
                    };

                    // Validate each filter array and ensure all items have required properties
                    const validatedOptions = {
                        sports: Array.isArray(filterOptions.sports)
                            ? filterOptions.sports.filter(item => item && item._id && item.name)
                            : [],
                        distances: Array.isArray(filterOptions.distances)
                            ? filterOptions.distances.filter(item => item && item._id && item.category)
                            : [],
                        sportSubTypes: Array.isArray(filterOptions.sportSubTypes)
                            ? filterOptions.sportSubTypes.filter(item => item && item._id && item.type)
                            : [],
                        ageCategories: Array.isArray(filterOptions.ageCategories)
                            ? filterOptions.ageCategories.filter(item => item && item._id && item.ageGroup)
                            : []
                    };

                    setFilterOptions(validatedOptions);
                }
            } catch (error: any) {
                console.error('Error loading filter options:', error);
                // Set empty options instead of failing completely
                setFilterOptions({
                    sports: [],
                    distances: [],
                    sportSubTypes: [],
                    ageCategories: []
                });
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error?.message || "Failed to load filter options"
                });
            }
        };

        if (sportId) {
        loadFilterOptions();
        }
    }, [toast, sportId]);

    // Validate pre-selected sport from URL params
    useEffect(() => {
        if (sportId && filterOptions.sports.length > 0) {
            const sportExists = filterOptions.sports.some(sport => sport._id === sportId);
            if (!sportExists) {
                // If the sport from URL doesn't exist in filter options, reset to 'all'
                setFilters(prev => ({ ...prev, sportId: '' }));
            }
        }
    }, [sportId, filterOptions.sports]);

    // Function to load students
    const loadStudents = useCallback(async () => {
        try {
            setLoading(true);
            console.log('Loading students with filters:', { ...filters, eventId });
            const response = await getFilterableStudents({
                ...filters,
                ...(eventId && { eventId }) // Only include eventId if it exists
            });

            console.log('Students response:', response);
            setStudents(response.students || []);
            setPagination(response.pagination || {
                currentPage: 1,
                totalPages: 1,
                totalStudents: 0,
                hasNext: false,
                hasPrev: false
            });
        } catch (error: any) {
            console.error('Error loading students:', error);
            setStudents([]);
            setPagination({
                currentPage: 1,
                totalPages: 1,
                totalStudents: 0,
                hasNext: false,
                hasPrev: false
            });
            toast({
                variant: "destructive",
                title: "Error",
                description: error?.message || "Failed to load students"
            });
        } finally {
            setLoading(false);
        }
    }, [filters, eventId, toast]);

    // Load students when filters change
    useEffect(() => {
        loadStudents();
    }, [loadStudents]);

    const handleFilterChange = (key: string, value: string) => {
        // Convert "all-*" values to empty string for API calls
        const apiValue = value.startsWith('all-') ? '' : value;

        setFilters(prev => ({
            ...prev,
            [key]: apiValue,
            page: 1 // Reset to first page when filters change
        }));
    };

    const handleSearch = (searchTerm: string) => {
        setFilters(prev => ({
            ...prev,
            search: searchTerm,
            page: 1
        }));
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const handleStudentSelect = (studentId: string, checked: boolean) => {
        const newSelected = new Set(selectedStudents);
        if (checked) {
            newSelected.add(studentId);
        } else {
            newSelected.delete(studentId);
        }
        setSelectedStudents(newSelected);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const eligibleStudentIds = students
                .filter(student => !student.isRegistered)
                .map(student => student._id);
            setSelectedStudents(new Set(eligibleStudentIds));
        } else {
            setSelectedStudents(new Set());
        }
    };

    const handleBulkRegister = async () => {
        if (selectedStudents.size === 0) {
            toast({
                variant: "destructive",
                title: "No Students Selected",
                description: "Please select at least one student to register"
            });
            return;
        }

        // Validate sportId is available
        if (!sportId) {
            toast({
                variant: "destructive",
                title: "Sport Information Missing",
                description: "Sport ID is required for registration. Please go back and select a sport."
            });
            return;
        }

        // Open registration payment modal
        if (selectedStudents.size === 0) {
            toast({
                variant: "destructive",
                title: "No Students Selected",
                description: "Please select at least one student to register"
            });
            return;
        }

        // Validate sportId is available
        if (!sportId) {
            toast({
                variant: "destructive",
                title: "Sport Information Missing",
                description: "Sport ID is required for registration. Please go back and select a sport."
            });
            return;
        }

        // Open the registration payment modal
        setRegistrationModalOpen(true);
    };

    // Payment handlers removed - payment gateways disabled
    // const handleSelfPayment = () => { ... }
    // const handleBankTransfer = () => { ... }

    const handleNotifyParents = async () => {
        try {
            // setPaymentChoiceModalOpen(false); // Removed - payment modals disabled
            setRegistering(true);

            const selectedStudentsList = Array.from(selectedStudents);

            if (!sportId || !eventId) {
                toast({
                    variant: "destructive",
                    title: "Missing Information",
                    description: "Sport ID and Event ID are required for parent notification"
                });
                return;
            }

            // Send parent notifications
            const response = await notifyParentsForPayment({
                studentIds: selectedStudentsList,
                eventId: eventId,
                sportId: sportId
            });

            toast({
                variant: "default",
                title: "Notifications Sent",
                description: `Parent payment notifications sent to ${response.data.emailsSent} email(s) for ${response.data.studentsCount} student(s)`
            });

            // Clear selected students and refresh the list
            setSelectedStudents(new Set());
            await loadStudents();

        } catch (error) {
            console.error('Error sending parent notifications:', error);
            toast({
                variant: "destructive",
                title: "Notification Failed",
                description: error.message || "Failed to send parent notifications"
            });
        } finally {
            setRegistering(false);
        }
    };

    // Payment success handler removed - payment gateways disabled
    // const handlePaymentSuccess = async (paymentData: any) => { ... }

    // Students are now pre-filtered on the server side when sportId is provided
    const eligibleStudents = students;
    const selectedCount = selectedStudents.size;
    const allEligibleSelected = eligibleStudents.length > 0 &&
        eligibleStudents.every(student => selectedStudents.has(student._id));

    console.log('StudentSelection Render:', { 
        loading, 
        studentsCount: students.length, 
        sportId, 
        eventId,
        filters 
    });

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Select Students for Registration</h1>
                        {sportName && (
                            <p className="text-gray-600">
                                Registering for: <span className="font-medium">{sportName}</span>
                                {isFromHomePage && <span className="text-sm text-gray-500 ml-2">(General Registration)</span>}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => navigate('/parent/students')}
                        variant="outline"
                        className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                    >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Students
                    </Button>
                {selectedCount > 0 && (
                    <Button
                        onClick={handleBulkRegister}
                        disabled={registering}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {registering ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <UserCheck className="h-4 w-4 mr-2" />
                        )}
                        Register {selectedCount} Students
                    </Button>
                )}
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filters
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Search */}
                    <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by name or UID..."
                            value={filters.search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>

                    {/* Filter Dropdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label>Sport</Label>
                            <Select
                                value={
                                    filters.sportId && filterOptions.sports.some(s => s._id === filters.sportId)
                                        ? filters.sportId
                                        : 'all-sports'
                                }
                                onValueChange={(value) => handleFilterChange('sportId', value)}
                                disabled={!!sportId} // Disable when sport is pre-selected from URL
                            >
                                <SelectTrigger className={sportId ? "opacity-75" : ""}>
                                    <SelectValue placeholder={sportId ? sportName || "Selected Sport" : "All Sports"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {!sportId && <SelectItem value="all-sports">All Sports</SelectItem>}
                                    {filterOptions.sports
                                        .filter(sport => sport && sport._id && sport.name)
                                        .map(sport => (
                                            <SelectItem key={sport._id} value={sport._id}>
                                                {sport.name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Only show Distance filter if there are distances available */}
                        {filterOptions.distances.length > 0 && (
                            <div className="space-y-2">
                                <Label>Distance</Label>
                                <Select
                                    value={
                                        filters.distanceId && filterOptions.distances.some(d => d._id === filters.distanceId)
                                            ? filters.distanceId
                                            : 'all-distances'
                                    }
                                    onValueChange={(value) => handleFilterChange('distanceId', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Distances" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all-distances">All Distances</SelectItem>
                                        {filterOptions.distances
                                            .filter(distance => distance && distance._id && distance.category)
                                            .map(distance => (
                                                <SelectItem key={distance._id} value={distance._id}>
                                                    {distance.category}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Only show Sport Sub Type filter if there are sub types available */}
                        {filterOptions.sportSubTypes.length > 0 && (
                            <div className="space-y-2">
                                <Label>Sport Sub Type</Label>
                                <Select
                                    value={
                                        filters.sportSubTypeId && filterOptions.sportSubTypes.some(st => st._id === filters.sportSubTypeId)
                                            ? filters.sportSubTypeId
                                            : 'all-subtypes'
                                    }
                                    onValueChange={(value) => handleFilterChange('sportSubTypeId', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Sub Types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all-subtypes">All Sub Types</SelectItem>
                                        {filterOptions.sportSubTypes
                                            .filter(subType => subType && subType._id && subType.type)
                                            .map(subType => (
                                                <SelectItem key={subType._id} value={subType._id}>
                                                    {subType.type}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Only show Age Category filter if there are age categories available */}
                        {filterOptions.ageCategories.length > 0 && (
                            <div className="space-y-2">
                                <Label>Age Category</Label>
                                <Select
                                    value={
                                        filters.ageCategoryId && filterOptions.ageCategories.some(ac => ac._id === filters.ageCategoryId)
                                            ? filters.ageCategoryId
                                            : 'all-agecategories'
                                    }
                                    onValueChange={(value) => handleFilterChange('ageCategoryId', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Age Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all-agecategories">All Age Categories</SelectItem>
                                        {filterOptions.ageCategories
                                            .filter(category => category && category._id && category.ageGroup)
                                            .map(category => (
                                                <SelectItem key={category._id} value={category._id}>
                                                    {category.ageGroup}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Results Summary */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span className="text-sm text-gray-600">
                            {pagination.totalStudents} students found
                        </span>
                    </div>
                    {selectedCount > 0 && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {selectedCount} selected
                        </Badge>
                    )}
                </div>

                {eligibleStudents.length > 0 && (
                    <div className="flex items-center gap-2">
                        <Checkbox
                            checked={allEligibleSelected}
                            onCheckedChange={handleSelectAll}
                            id="select-all"
                        />
                        <Label htmlFor="select-all" className="text-sm">
                            Select all eligible ({eligibleStudents.length})
                        </Label>
                    </div>
                )}
            </div>

            {/* Student List */}
            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            <span className="ml-2">Loading students...</span>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="text-center py-8">
                            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
                            <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                            <Button
                                onClick={() => navigate('/parent/students')}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <UserPlus className="h-4 w-4 mr-2" />
                                Add Students
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {students.map((student) => (
                                <div
                                    key={student._id}
                                    className="p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Checkbox
                                                checked={selectedStudents.has(student._id)}
                                                onCheckedChange={(checked) =>
                                                    handleStudentSelect(student._id, checked as boolean)
                                                }
                                            />

                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h4 className="font-medium text-gray-900">{student.name}</h4>
                                                    <Badge variant="outline" className="text-xs">
                                                        {student.uid}
                                                    </Badge>
                                                    {student.isRegistered && (
                                                        <Badge className="bg-green-100 text-green-800">
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            Registered
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        Age {student.age}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Target className="h-3 w-3" />
                                                        {student.sport?.name || 'N/A'}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {student.distance?.category || 'N/A'}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <GraduationCap className="h-3 w-3" />
                                                        {student.ageCategory?.ageGroup || 'N/A'}
                                                    </div>
                                                </div>

                                                {student.sportSubType?.type && (
                                                    <div className="mt-2">
                                                        <Badge variant="secondary" className="text-xs">
                                                            {student.sportSubType.type}
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={!pagination.hasPrev}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={!pagination.hasNext}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Selection Summary */}
            {selectedCount > 0 && (
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <UserCheck className="h-5 w-5 text-blue-600" />
                                <span className="font-medium text-blue-900">
                                    {selectedCount} students selected for registration
                                </span>
                            </div>
                            <Button
                                onClick={handleBulkRegister}
                                disabled={registering}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                {registering ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                )}
                                Register Selected Students
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Registration Payment Modal */}
            <RegistrationPaymentModal
                open={registrationModalOpen}
                onClose={() => setRegistrationModalOpen(false)}
                studentIds={Array.from(selectedStudents)}
                eventId={eventId}
                sportId={sportId}
                sportName={sportName}
                studentCount={selectedStudents.size}
                country={country}
                onSuccess={async (result?: any) => {
                    // Log S3 link for debugging only (not shown to user)
                    if (result?.paymentScreenshot) {
                        console.log('Payment screenshot uploaded successfully:', result.paymentScreenshot);
                    }
                    
                    // Clear selections and reload data
                    setSelectedStudents(new Set());
                    await loadStudents();
                    
                    // Redirect to registrations page to view registered students
                    setTimeout(() => {
                        navigate('/parent/registrations');
                    }, 1500);
                }}
            />
        </div>
    );
} 