import { ROOMS } from "@/data/mockData";
import { BookingsStore } from "@/store/Bookings.store";
import { RoomStoreActions } from "@/store/Rooms.store";
import { ViewStore } from "@/store/View.store";
import { CalendarDays } from "lucide-react";

import { useSnapshot } from "valtio";

const Header = () => {
  const viewSnapshot = useSnapshot(ViewStore);
  const bookingsSnapshot = useSnapshot(BookingsStore);

  return (
    <div className="border-b border-border bg-card/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {viewSnapshot.view === "rooms" && "Meeting Rooms"}
              {viewSnapshot.view === "schedule" && "Schedule"}
              {viewSnapshot.view === "bookings" && "All Bookings"}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {viewSnapshot.view === "rooms" &&
                `${ROOMS.length} rooms available across ${[...new Set(ROOMS.map((r) => r.floor))].length} floors`}
              {viewSnapshot.view === "schedule" &&
                "Daily and weekly overview of room reservations"}
              {viewSnapshot.view === "bookings" &&
                `${bookingsSnapshot.bookings.length} total bookings`}
            </p>
          </div>
          {viewSnapshot.view === "rooms" && (
            <button
              onClick={() => RoomStoreActions.openNew()}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
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
