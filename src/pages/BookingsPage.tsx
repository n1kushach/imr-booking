import BookingsView from "@/components/BookingsView";
import { useBookings } from "@/services/api";

const BookingsPage = () => {
  const { isLoading: isBookingsLoading, isError: isBookingsError } =
    useBookings();
  return (
    <BookingsView isLoading={isBookingsLoading} isError={isBookingsError} />
  );
};

export default BookingsPage;
