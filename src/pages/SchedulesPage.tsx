import Schedule from "@/components/schedule/Schedule";
import { useBookings, useRooms } from "@/services/api";
import { BookingsStore, BookingStoreActions } from "@/store/Bookings.store";
import { CalendarDays } from "lucide-react";
import { useSnapshot } from "valtio";

const SchedulesPage = () => {
  const BookingsSnapshot = useSnapshot(BookingsStore) as typeof BookingsStore;
  const roomsQuery = useRooms();
  const bookingsQuery = useBookings();

  const isLoadingRooms =
    roomsQuery.isLoading && !BookingsSnapshot.bookings.length;
  const isLoadingBookings =
    bookingsQuery.isLoading && !BookingsSnapshot.bookings.length;

  const isError = roomsQuery.isError || bookingsQuery.isError;
  const isLoading = isLoadingRooms || isLoadingBookings;

  if (isLoading) {
    return <div>Loading schedule...</div>;
  }

  if (isError) {
    return <div>Failed to load schedule.</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <div>
        <button
          onClick={() => BookingStoreActions.openNew()}
          className="flex items-center gap-2 px-4 text-[10px] py-2 bg-primary text-primary-foreground rounded-md whitespace-nowrap md:text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <CalendarDays className="w-4 h-4" />
          New Booking
        </button>
      </div>
      <Schedule bookings={BookingsSnapshot.bookings} />
    </div>
  );
};

export default SchedulesPage;
