import { useSnapshot } from "valtio";
import { BookingsStore } from "@/store/Bookings.store";

export default function App() {
  const bookingsSnapshot = useSnapshot(BookingsStore) as typeof BookingsStore;
  console.log(bookingsSnapshot.bookings, "Bookings");

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
      {/* {viewSnapshot.view === "schedule" && (
        <ScheduleView
          onNew={(date) => console.log(date)}
          onEdit={() => {
            console.log("openEdit");
          }}
        />
      )} */}
    </main>
  );
}
