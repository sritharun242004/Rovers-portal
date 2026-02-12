import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, School, Building } from "lucide-react"
import { QrScannerDialog } from "./QrScannerDialog"
import io from "socket.io-client"

const VITE_API_URL = import.meta.env.VITE_API_URL;
const socket = io(VITE_API_URL || "http://localhost:3000")

const checkpoints = [
  {
    id: 'entrance checkin',
    name: 'Checkpoint 1',
    description: 'Classroom Block Entrance',
    color: 'from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30',
    icon: School,
    iconColor: 'text-blue-500'
  },
  {
    id: 'sports checkin',
    name: 'Checkpoint 2',
    description: 'Sports Complex',
    color: 'from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30',
    icon: MapPin,
    iconColor: 'text-emerald-500'
  },
  {
    id: 'checkout',
    name: 'Checkpoint 3',
    description: 'Administrative Block',
    color: 'from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30',
    icon: Building,
    iconColor: 'text-purple-500'
  }
]

export function CheckpointContent() {
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<string | null>(null);
  const checkpoint = localStorage.getItem("checkpoint")
  console.log("checkpointttt",checkpoint)

  const getAssignedCheckpoint = () => {
    return checkpoints.find(cp => cp.name === checkpoint);
  };

  const assignedCheckpoint = getAssignedCheckpoint();

  const handleSuccess = (studentData: any) => {
    socket.emit("qrData", studentData)
    setSelectedCheckpoint(null)
  }

  if (!assignedCheckpoint) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center h-[80vh]">
        <Card className="w-full max-w-md text-center p-6">
          <CardTitle className="mb-4">No Checkpoint Assigned</CardTitle>
          <p className="text-muted-foreground">
            You haven't been assigned to any checkpoint. Please contact the administrator.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Card
          className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer bg-gradient-to-br ${assignedCheckpoint.color}`}
        >
          <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-xl rounded-lg" />
          <CardHeader className="relative">
            <div className="flex items-center space-x-2">
              <assignedCheckpoint.icon className={`h-6 w-6 ${assignedCheckpoint.iconColor}`} />
              <CardTitle>{assignedCheckpoint.name}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <p className="text-sm text-muted-foreground mb-4">{assignedCheckpoint.description}</p>
            <Button
              className="w-full bg-white/80 hover:bg-white/90 text-foreground"
              onClick={() => setSelectedCheckpoint(assignedCheckpoint.id)}
            >
              Scan QR Code
            </Button>
          </CardContent>
        </Card>
      </div>

      <QrScannerDialog
        open={!!selectedCheckpoint}
        onOpenChange={(open) => !open && setSelectedCheckpoint(null)}
        checkpoint={selectedCheckpoint || ''}
        onSuccess={handleSuccess}
      />
    </div>
  )
}