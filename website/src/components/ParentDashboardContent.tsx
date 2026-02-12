import { EventCards } from './EventCards';

export function ParentDashboardContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Home</h2>
      <EventCards />
    </div>
  );
}