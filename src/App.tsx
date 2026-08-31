import { useState } from "react";
import { INITIAL_BOOKINGS } from "./data/mockData";
import BookingsView from "@/components/BookingsView";
import ScheduleView from "@/components/ScheduleView";
import type { Booking } from "./types/booking";
import RoomsView from "@/components/RoomsView";
import { useSnapshot } from "valtio";
import { ViewStore } from "@/store/View.store";
import { useRooms } from "@/services/api";
import { RoomStoreActions } from "@/store/Rooms.store";

export default function App() {
  const viewSnapshot = useSnapshot(ViewStore);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  const { isLoading } = useRooms();

  // const handleSave = (booking: Booking) => {
  //   setBookings((prev) => {
  //     const idx = prev.findIndex((b) => b.id === booking.id);
  //     return idx >= 0
  //       ? prev.map((b) => (b.id === booking.id ? booking : b))
  //       : [...prev, booking];
  //   });
  // };

  const handleCancel = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
      {viewSnapshot.view === "rooms" && (
        <RoomsView
          isLoading={isLoading}
          bookings={bookings}
          onBook={(room) => RoomStoreActions.openNew(room)}
        />
      )}
      {viewSnapshot.view === "schedule" && (
        <ScheduleView
          bookings={bookings}
          onNew={(date) => console.log(date)}
          onEdit={() => {
            console.log("openEdit");
          }}
        />
      )}
      {viewSnapshot.view === "bookings" && (
        <BookingsView
          bookings={bookings}
          onEdit={() => {
            console.log("openEdit");
          }}
          onCancel={handleCancel}
          onNew={() => console.log("openNew")}
        />
      )}
    </main>

    // {/* Booking form modal */}
    // <BookingForm
    //   open={formOpen}
    //   onClose={() => setFormOpen(false)}
    //   onSave={handleSave}
    //   initial={editBooking}
    //   preselectedRoom={preselectedRoom}
    //   preselectedDate={preselectedDate}
    // />
  );
}
