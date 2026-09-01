import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ROOMS, CURRENT_USER } from "../data/mockData";
import type { Booking } from "@/types/booking";
import { useSnapshot } from "valtio";
import { BookingsStore, BookingStoreActions } from "@/store/Bookings.store";
import BookingList from "@/components/booking-list/BookingList";

interface IBookingsView {
  isLoading: boolean;
  isError: boolean;
}

export default function BookingsView(props: IBookingsView) {
  const { isLoading, isError } = props;
  const bookingsSnapshot = useSnapshot(BookingsStore) as typeof BookingsStore;
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "mine" | "upcoming" | "past">(
    "upcoming",
  );

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const nowTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const isUpcoming = (b: Booking) =>
    b.date > todayStr || (b.date === todayStr && b.endTime > nowTime);
  const isPast = (b: Booking) =>
    b.date < todayStr || (b.date === todayStr && b.endTime <= nowTime);

  const filtered = bookingsSnapshot.bookings
    .filter((b) => {
      const matchSearch =
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        ROOMS.find((r) => r.id === b.roomId)
          ?.name.toLowerCase()
          .includes(search.toLowerCase()) ||
        b.organizer.toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        filter === "all" ||
        (filter === "mine" && b.organizer === CURRENT_USER) ||
        (filter === "upcoming" && isUpcoming(b)) ||
        (filter === "past" && isPast(b));
      return matchSearch && matchFilter;
    })
    .sort((a, b) => (a.date + a.startTime < b.date + b.startTime ? -1 : 1));

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative sm:max-w-xs w-full">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex gap-1.5">
            {(["upcoming", "mine", "all", "past"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors capitalize ${
                  filter === f
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {f === "mine" ? "My Bookings" : f}
              </button>
            ))}
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => BookingStoreActions.openNew()}
          className="gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          New Booking
        </Button>
      </div>

      <BookingList filtered={filtered} />
    </div>
  );
}
