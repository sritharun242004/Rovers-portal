import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, LogOut } from 'lucide-react';
import { getAttendanceStats, subscribeToStatistics } from '@/api/attendance';

interface SportBreakdown {
  entrance: Array<{ sport: string; count: number; }>;
  sports: Array<{ sport: string; count: number; }>;
  exit: Array<{ sport: string; count: number; }>;
}

interface AttendanceStats {
  totalRegistered: number;
  entranceCount: number;
  sportsCount: number;
  exitCount: number;
  sportBreakdown: SportBreakdown;
}

export function LiveDashboardContent() {
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAttendanceStats();
        setStats(response);
      } catch (error: any) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchData();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToStatistics((newStats) => {
      setStats(newStats);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleCardClick = (checkpointType: string) => {
    navigate(`/students?checkpoint=${checkpointType}`);
  };

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          className="relative overflow-hidden transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-indigo-400/20 to-violet-600/20 dark:from-indigo-500/10 dark:to-violet-700/10 hover:scale-[1.02] cursor-pointer"
          onClick={() => handleCardClick('Entrance Checkin')}
        >
          <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-xl rounded-lg" />
          <CardHeader className="relative flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">
              <Users className="w-4 h-4 inline-block mr-2 text-indigo-600 dark:text-indigo-400" />
              Entrance Checkin
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{stats.entranceCount}/{stats.totalRegistered}</div>
            <p className="text-xs text-indigo-600/80 dark:text-indigo-400/80">
              {((stats.entranceCount / stats.totalRegistered) * 100).toFixed(1)}% checked in
            </p>
          </CardContent>
        </Card>

        <Card
          className="relative overflow-hidden transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-purple-400/20 to-pink-600/20 dark:from-purple-500/10 dark:to-pink-700/10 hover:scale-[1.02] cursor-pointer"
          onClick={() => handleCardClick('Sports Checkin')}
        >
          <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-xl rounded-lg" />
          <CardHeader className="relative flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">
              <Activity className="w-4 h-4 inline-block mr-2 text-purple-600 dark:text-purple-400" />
              Sports Checkin
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.sportsCount}/{stats.entranceCount}</div>
            <p className="text-xs text-purple-600/80 dark:text-purple-400/80">
              {((stats.sportsCount / stats.entranceCount) * 100).toFixed(1)}% participating in sports
            </p>
          </CardContent>
        </Card>

        <Card
          className="relative overflow-hidden transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-cyan-400/20 to-teal-600/20 dark:from-cyan-500/10 dark:to-teal-700/10 hover:scale-[1.02] cursor-pointer"
          onClick={() => handleCardClick('Checkout')}
        >
          <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-xl rounded-lg" />
          <CardHeader className="relative flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">
              <LogOut className="w-4 h-4 inline-block mr-2 text-cyan-600 dark:text-cyan-400" />
              Checkout
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">{stats.exitCount}/{stats.sportsCount}</div>
            <p className="text-xs text-cyan-600/80 dark:text-cyan-400/80">
              {((stats.exitCount / stats.sportsCount) * 100).toFixed(1)}% checked out
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.sportBreakdown.entrance.map((sport, index) => (
          <Card key={sport.sport} className="relative overflow-hidden transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-fuchsia-400/10 to-fuchsia-600/10 dark:from-fuchsia-500/5 dark:to-fuchsia-700/5 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-xl rounded-lg" />
            <CardHeader className="relative pb-2">
              <CardTitle className="text-sm font-medium text-fuchsia-700 dark:text-fuchsia-300">{sport.sport}</CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-fuchsia-600/80 dark:text-fuchsia-400/80">Entrance:</span>
                  <span className="font-medium text-fuchsia-700 dark:text-fuchsia-300">{stats.sportBreakdown.entrance[index].count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-fuchsia-600/80 dark:text-fuchsia-400/80">Active:</span>
                  <span className="font-medium text-fuchsia-700 dark:text-fuchsia-300">{stats.sportBreakdown.sports[index].count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-fuchsia-600/80 dark:text-fuchsia-400/80">Exit:</span>
                  <span className="font-medium text-fuchsia-700 dark:text-fuchsia-300">{stats.sportBreakdown.exit[index].count}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}