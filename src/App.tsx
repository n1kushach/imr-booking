import { useState } from "react";
import { INITIAL_BOOKINGS } from "./data/mockData";
import BookingsView from "@/components/BookingsView";
import ScheduleView from "@/components/ScheduleView";
import type { Booking } from "./types/booking";
import RoomsView from "@/components/RoomsView";
import { useSnapshot } from "valtio";
import { ViewStore } from "@/store/View.store";
import { useBookings, useRooms } from "@/services/api";
import { BookingsStore, BookingStoreActions } from "@/store/Bookings.store";

export default function App() {
  const viewSnapshot = useSnapshot(ViewStore);
  // bookingsSnapshot for dev
  const bookingsSnapshot = useSnapshot(BookingsStore) as typeof BookingsStore;
  console.log(bookingsSnapshot.bookings, "Bookings");
  const { isLoading: isRoomsLoading } = useRooms();
  const { isLoading: isBookingsLoading } = useBookings();

  // const handleSave = (booking: Booking) => {
  //   setBookings((prev) => {
  //     const idx = prev.findIndex((b) => b.id === booking.id);
  //     return idx >= 0
  //       ? prev.map((b) => (b.id === booking.id ? booking : b))
  //       : [...prev, booking];
  //   });
  // };

  const handleCancel = (id: string) => {
    console.log(id, "ID");
    // setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
      {viewSnapshot.view === "rooms" && (
        <RoomsView
          isBookingsLoading={isBookingsLoading}
          isRoomsLoading={isRoomsLoading}
          // bookings={bookings}
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
      {viewSnapshot.view === "bookings" && (
        <BookingsView
          // bookings={bookings}
          onEdit={() => {
            console.log("openEdit");
          }}
          onCancel={handleCancel}
          onNew={() => console.log("openNew")}
        />
      )}
    </main>
  );
}
