import BookingCard from "@/components/booking-card/BookingCard";
import type { Booking } from "@/types/booking";
import { Calendar } from "lucide-react";

interface IBookingList {
  filtered: Booking[];
}

const BookingList = (props: IBookingList) => {
  const { filtered } = props;
  return filtered.length === 0 ? (
    <div className="text-center py-16 text-muted-foreground">
      <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
      <p className="text-sm">No bookings found.</p>
    </div>
  ) : (
    <div className="space-y-2">
      {filtered.map((booking) => {
        return <BookingCard booking={booking} />;
      })}
    </div>
  );
};

export default BookingList;
