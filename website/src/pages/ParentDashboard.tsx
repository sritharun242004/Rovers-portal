import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ParentDashboardContent } from '@/components/ParentDashboardContent';
import { Users, ClipboardList } from "lucide-react"

export function ParentDashboard() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Navigation Menu */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50">
        <div className="flex justify-around items-center">
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1"
            onClick={() => navigate('/parent/students')}
          >
            <Users className="h-5 w-5" />
            <span className="text-xs">Students</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1"
            onClick={() => navigate('/parent/registrations')}
          >
            <ClipboardList className="h-5 w-5" />
            <span className="text-xs">Registrations</span>
          </Button>
        </div>
      </div>

      {/* Original Content */}
      <div className="pb-24 md:pb-0">
        <ParentDashboardContent />
      </div>
    </div>
  )
}