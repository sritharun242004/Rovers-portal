import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { getStudents, getSports } from "@/api/students";
import { useToast } from "@/hooks/useToast";

interface Student {
  _id: string;
  name: string;
  uid: string;
  sport: string;
  location: string;
  status: 'not visited' | 'entrance checkin' | 'sports checkin' | 'checkout' | 'registered' | 'not registered';
  isRegistered?: boolean;
  registrationCount?: number;
}

interface GetStudentsParams {
  search?: string;
  sport?: string;
  status?: string;
}

const statusColors = {
  'not visited': 'bg-gray-500',
  'entrance checkin': 'bg-blue-500',
  'sports checkin': 'bg-green-500',
  'checkout': 'bg-purple-500',
  'registered': 'bg-green-600',
  'not registered': 'bg-red-500'
} as const;

// Helper function to normalize status
const normalizeStatus = (status: string): Student['status'] => {
  const normalized = status.toLowerCase().replace(/\s+/g, ' ');
  return normalized as Student['status'];
};

export function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [sports, setSports] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSport, setSelectedSport] = useState("all");
  const { toast } = useToast();
  const location = useLocation();
  const checkpoint = new URLSearchParams(location.search).get('checkpoint');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsResponse, sportsResponse] = await Promise.all([
          getStudents({
            ...(checkpoint ? { status: normalizeStatus(checkpoint) } : {
              search,
              sport: selectedSport === "all" ? "" : selectedSport
            })
          }),
          getSports()
        ]);
        setStudents(studentsResponse.students);
        setSports(sportsResponse.sports);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch student data"
        });
      }
    };
    fetchData();
  }, [search, selectedSport, checkpoint, toast]);

  // Remove the client-side filtering since we're now handling it on the server
  const filteredStudents = students;

  return (
    <Card className="min-h-[calc(100vh-10rem)]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Student Data {checkpoint && `- ${checkpoint}`}
        </CardTitle>
        {!checkpoint && (
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, UID, sport, location, or status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={selectedSport} onValueChange={setSelectedSport}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by sport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  {sports.map((sport) => (
                    <SelectItem key={sport} value={sport}>
                      {sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>UID</TableHead>
                <TableHead>Sport</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registration Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student._id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.uid}</TableCell>
                  <TableCell>{student.sport}</TableCell>
                  <TableCell>{student.location}</TableCell>
                  <TableCell>
                    {/* Show attendance status for checkpoint queries, registration status otherwise */}
                    {checkpoint ? (
                      <Badge className={statusColors[student.status]}>
                        {student.status}
                      </Badge>
                    ) : (
                      <span className="text-sm text-gray-600">
                        {student.status === 'registered' ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[student.status === 'registered' ? 'registered' : 'not registered']}>
                        {student.status === 'registered' ? 'Registered' : 'Not Registered'}
                      </Badge>
                      {student.registrationCount && student.registrationCount > 1 && (
                        <span className="text-xs text-gray-500">
                          ({student.registrationCount} sports)
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}