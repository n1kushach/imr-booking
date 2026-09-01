import BookingView from "@/components/bookings-view/BookingView";
import { useBookings } from "@/services/api";

const BookingsPage = () => {
  const { isLoading: isBookingsLoading, isError: isBookingsError } =
    useBookings();
  return (
    <BookingView isLoading={isBookingsLoading} isError={isBookingsError} />
  );
};

export default BookingsPage;
