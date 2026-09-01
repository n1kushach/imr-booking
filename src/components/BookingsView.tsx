import { useState } from "react";
import {
  Search,
  Calendar,
  Clock,
  Users,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ROOMS, CURRENT_USER } from "../data/mockData";
import type { Booking } from "@/types/booking";
import { useSnapshot } from "valtio";
import { BookingsStore, BookingStoreActions } from "@/store/Bookings.store";
import { RoomsStore } from "@/store/Rooms.store";

export default function BookingsView() {
  const bookingsSnapshot = useSnapshot(BookingsStore) as typeof BookingsStore;
  const roomsSnapshot = useSnapshot(RoomsStore) as typeof RoomsStore;
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

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    if (diff === -1) return "Yesterday";
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getRoom = (roomId: string) =>
    roomsSnapshot.rooms.find((r) => r.id === roomId);

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

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No bookings found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((booking) => {
            const room = getRoom(booking.roomId);
            const past = isPast(booking);
            const isMine = booking.organizer === CURRENT_USER;
            return (
              <Card
                key={booking.id}
                className={`transition-colors ${past ? "opacity-60" : "hover:border-primary/30"}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm truncate">
                          {booking.title}
                        </span>
                        {isMine && (
                          <Badge
                            variant="default"
                            className="text-[10px] shrink-0"
                          >
                            Organizer
                          </Badge>
                        )}
                        {past && (
                          <Badge
                            variant="outline"
                            className="text-[10px] shrink-0"
                          >
                            Past
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(booking.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {booking.startTime} – {booking.endTime}
                        </span>
                        {room && (
                          <span className="flex items-center gap-1 font-medium text-foreground">
                            {room.name}, Floor {room.floor}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {booking.attendees.length > 0
                            ? `${booking.attendees.slice(0, 2).join(", ")}${booking.attendees.length > 2 ? ` +${booking.attendees.length - 2}` : ""}`
                            : "No attendees"}
                        </span>
                      </div>
                      {booking.notes && (
                        <p className="text-xs text-muted-foreground italic">
                          {booking.notes}
                        </p>
                      )}
                    </div>
                    {isMine && !past && (
                      <div className="flex gap-1.5 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => {
                            BookingStoreActions.openEdit(booking);
                          }}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() =>
                            BookingStoreActions.deleteBooking(booking.id)
                          }
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
