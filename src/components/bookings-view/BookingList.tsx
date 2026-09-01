import BookingCard from "@/components/bookings-view/BookingCard";
import BookingListSkeleton from "@/components/bookings-view/BookingList.skeleton";
import type { Booking } from "@/types/booking";
import { Calendar } from "lucide-react";

interface IBookingList {
  filtered: Booking[];
  isLoading: boolean;
}

const BookingList = (props: IBookingList) => {
  const { filtered, isLoading } = props;

  if (isLoading == false && filtered.length == 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="text-sm">No bookings found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {isLoading
        ? Array.from({ length: 4 }).map((_, index) => {
            return <BookingListSkeleton key={index} />;
          })
        : filtered.map((booking) => {
            return <BookingCard key={booking.id} booking={booking} />;
          })}
    </div>
  );
};

export default BookingList;
