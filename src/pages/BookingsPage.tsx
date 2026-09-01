import BookingView from "@/components/bookings-view/BookingView";
import { useBookings } from "@/services/api";
import { BookingsStore } from "@/store/Bookings.store";
import { useSnapshot } from "valtio";

const BookingsPage = () => {
  const snapshot = useSnapshot(BookingsStore) as typeof BookingsStore;
  const { isLoading: isBookingsLoading, isError: isBookingsError } =
    useBookings();

  return (
    <BookingView
      isLoading={isBookingsLoading && snapshot.bookings.length === 0}
      isError={isBookingsError}
    />
  );
};

export default BookingsPage;
