import { Input } from "@/components/ui/input";
import { BookingsStore } from "@/store/Bookings.store";
import { Search } from "lucide-react";
import { useSnapshot } from "valtio";

const BookingFilter = () => {
  const bookingsSnapshot = useSnapshot(BookingsStore) as typeof BookingsStore;

  return (
    <div className="flex flex-col sm:flex-row gap-3 flex-1">
      <div className="relative sm:max-w-xs w-full">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search bookings..."
          value={bookingsSnapshot.filters.search}
          onChange={(e) => (BookingsStore.filters.search = e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="flex gap-1.5">
        {(["upcoming", "mine", "all", "past"] as const).map((f) => (
          <button
            key={f}
            onClick={() => (BookingsStore.filters.type = f)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors capitalize ${
              bookingsSnapshot.filters.type === f
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
            }`}
          >
            {f === "mine" ? "My Bookings" : f}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookingFilter;
