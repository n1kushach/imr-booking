import { ROOMS } from "@/data/mockData";
import { BookingsStore, BookingStoreActions } from "@/store/Bookings.store";
import { CalendarDays } from "lucide-react";
import { useLocation } from "react-router";

import { useSnapshot } from "valtio";

const Header = () => {
  const location = useLocation();
  const bookingsSnapshot = useSnapshot(BookingsStore);

  return (
    <div className="border-b border-border bg-card/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex items-center md:items-end justify-between">
          <div>
            <h1 className="font-semibold tracking-tight whitespace-nowrap text-[14px] md:text-2xl">
              {location.pathname == "/" && "Meeting Rooms"}
              {location.pathname == "/schedule" && "Schedule"}
              {location.pathname == "/bookings" && "All Bookings"}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5 hidden md:block">
              {location.pathname == "/" &&
                `${ROOMS.length} rooms available across ${[...new Set(ROOMS.map((r) => r.floor))].length} floors`}
              {location.pathname == "/schedule" &&
                "Daily and weekly overview of room reservations"}
              {location.pathname == "/bookings" &&
                `${bookingsSnapshot.bookings.length} total bookings`}
            </p>
          </div>
          {location.pathname == "/" && (
            <button
              onClick={() => BookingStoreActions.openNew()}
              className="flex items-center gap-2 px-4 text-[10px] py-2 bg-primary text-primary-foreground rounded-md whitespace-nowrap md:text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <CalendarDays className="w-4 h-4" />
              New Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
