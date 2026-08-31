export interface Booking {
  id: string;
  roomId: string;
  title: string;
  organizer: string;
  attendees: string[];
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  notes?: string;
}
