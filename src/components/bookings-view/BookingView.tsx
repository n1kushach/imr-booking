import { CalendarDays } from "lucide-react";
import { CURRENT_USER } from "../../data/mockData";
import type { Booking } from "@/types/booking";
import { useSnapshot } from "valtio";
import { BookingsStore, BookingStoreActions } from "@/store/Bookings.store";
import BookingList from "@/components/bookings-view/BookingList";
import { useMemo } from "react";
import BookingFilter from "@/components/bookings-view/BookingFilter";
import { toast } from "sonner";
import { RoomsStore } from "@/store/Rooms.store";

interface IBookingsView {
  isLoading: boolean;
  isError: boolean;
}

const BookingsView = (props: IBookingsView) => {
  const { isLoading, isError } = props;
  const bookingsSnapshot = useSnapshot(BookingsStore) as typeof BookingsStore;
  const roomsSnapshot = useSnapshot(RoomsStore) as typeof RoomsStore;

  if (isError) {
    toast.error("Failed to fetch bookings");
  }

  const filtered = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const nowTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const isUpcoming = (b: Booking) =>
      b.date > todayStr || (b.date === todayStr && b.endTime > nowTime);
    const isPast = (b: Booking) =>
      b.date < todayStr || (b.date === todayStr && b.endTime <= nowTime);

    return bookingsSnapshot.bookings
      .filter((b) => {
        const matchSearch =
          b.title
            .toLowerCase()
            .includes(bookingsSnapshot.filters.search.toLowerCase()) ||
          roomsSnapshot.rooms
            .find((r) => r.id === b.roomId)
            ?.name.toLowerCase()
            .includes(bookingsSnapshot.filters.search.toLowerCase()) ||
          b.organizer
            .toLowerCase()
            .includes(bookingsSnapshot.filters.search.toLowerCase());

        const matchFilter =
          bookingsSnapshot.filters.type === "all" ||
          (bookingsSnapshot.filters.type === "mine" &&
            b.organizer === CURRENT_USER) ||
          (bookingsSnapshot.filters.type === "upcoming" && isUpcoming(b)) ||
          (bookingsSnapshot.filters.type === "past" && isPast(b));

        return matchSearch && matchFilter;
      })
      .sort((a, b) => (a.date + a.startTime < b.date + b.startTime ? -1 : 1));
  }, [
    bookingsSnapshot.bookings,
    bookingsSnapshot.filters.search,
    bookingsSnapshot.filters.type,
  ]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <BookingFilter />
        <button
          onClick={() => BookingStoreActions.openNew()}
          className="flex items-center gap-2 px-4 text-[10px] py-2 bg-primary text-primary-foreground rounded-md whitespace-nowrap md:text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <CalendarDays className="w-4 h-4" />
          New Booking
        </button>
      </div>
      <BookingList isLoading={isLoading} filtered={filtered} />
    </div>
  );
};

export default BookingsView;
