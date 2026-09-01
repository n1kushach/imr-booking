import BookingsView from "@/components/BookingsView";
import ScheduleView from "@/components/ScheduleView";
import RoomsView from "@/components/RoomsView";
import { useSnapshot } from "valtio";
import { ViewStore } from "@/store/View.store";
import { useBookings, useRooms } from "@/services/api";
import { BookingsStore, BookingStoreActions } from "@/store/Bookings.store";
import { toast } from "sonner";

export default function App() {
  const viewSnapshot = useSnapshot(ViewStore);
  const bookingsSnapshot = useSnapshot(BookingsStore) as typeof BookingsStore;
  console.log(bookingsSnapshot.bookings, "Bookings");
  const { isLoading: isRoomsLoading, isError: isRoomsError } = useRooms();
  const { isLoading: isBookingsLoading, isError: isBookingsError } =
    useBookings();

  if (isBookingsError || isRoomsError) {
    toast.error("Failed to fetch");
  }

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
      {viewSnapshot.view === "rooms" && (
        <RoomsView
          isBookingsError={isBookingsError}
          isRoomsError={isRoomsError}
          isBookingsLoading={isBookingsLoading}
          isRoomsLoading={isRoomsLoading}
          onBook={(room) => BookingStoreActions.openNew(room)}
        />
      )}
      {viewSnapshot.view === "schedule" && (
        <ScheduleView
          onNew={(date) => console.log(date)}
          onEdit={() => {
            console.log("openEdit");
          }}
        />
      )}
      {viewSnapshot.view === "bookings" && <BookingsView />}
    </main>
  );
}
