import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { SportFAQs } from './SportFAQs';

interface SportDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sport: {
    _id: string;
    name: string;
    description: string;
    duration: string;
    eventName: string;
    location: string;
    address: string;
    mapsLink: string;
    image: string;
    startDate: string;
    endDate: string;
  };
  onRegister: () => void;
}

export function SportDetailDialog({ open, onOpenChange, sport, onRegister }: SportDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{sport.name}</DialogTitle>
          {sport.eventName && (
            <DialogDescription className="text-sm">
              Part of <span className="font-medium">{sport.eventName}</span>
            </DialogDescription>
          )}
        </DialogHeader>

        {sport.image && (
          <div className="w-full aspect-video bg-muted rounded-md overflow-hidden">
            <img
              src={sport.image}
              alt={sport.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="space-y-3">
          {sport.description && (
            <div>
              <h3 className="font-semibold mb-1">Description</h3>
              <p className="text-sm text-muted-foreground">{sport.description}</p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {new Date(sport.startDate).toLocaleDateString()} - {new Date(sport.endDate).toLocaleDateString()}
            </span>
          </div>

          {sport.duration && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{sport.duration}</span>
            </div>
          )}

          {sport.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{sport.location}</span>
            </div>
          )}

          {sport.address && (
            <div className="ml-6 text-sm text-muted-foreground">
              {sport.address}
              {sport.mapsLink && (
                <div className="mt-1">
                  <a
                    href={sport.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View on Google Maps
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <SportFAQs sportId={sport._id} />

        <div className="flex justify-end mt-4">
          <Button onClick={onRegister} className="bg-blue-600 hover:bg-blue-700">
            Register
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}