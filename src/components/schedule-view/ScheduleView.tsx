import { useState } from "react";
import type { ScheduleMode } from "@/types/schedule";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { BookingsStore, BookingStoreActions } from "@/store/Bookings.store";
import { useSnapshot } from "valtio";
import { RoomsStore } from "@/store/Rooms.store";

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 08:00 – 20:00

const timeToFraction = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h - 8 + m / 60;
};

const ROOM_COLORS = [
  "bg-blue-500/20 border-blue-500/40 text-blue-300",
  "bg-violet-500/20 border-violet-500/40 text-violet-300",
  "bg-emerald-500/20 border-emerald-500/40 text-emerald-300",
  "bg-amber-500/20 border-amber-500/40 text-amber-300",
  "bg-rose-500/20 border-rose-500/40 text-rose-300",
  "bg-cyan-500/20 border-cyan-500/40 text-cyan-300",
];

const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

const fmtDate = (d: Date) => d.toISOString().split("T")[0];

const fmtLabel = (d: Date) =>
  d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

export default function ScheduleView() {
  const bookingsSnapshot = useSnapshot(BookingsStore) as typeof BookingsStore;
  const roomsSnapshot = useSnapshot(RoomsStore) as typeof RoomsStore;
  const [mode, setMode] = useState<ScheduleMode>("day");
  const [baseDate, setBaseDate] = useState(new Date());

  const today = fmtDate(new Date());
  const CELL_HEIGHT = 56;

  const days =
    mode === "day"
      ? [baseDate]
      : Array.from({ length: 7 }, (_, i) => {
          const start = new Date(baseDate);
          const day = start.getDay();
          const monday = addDays(start, -((day + 6) % 7));
          return addDays(monday, i);
        });

  const navigate = (dir: number) => {
    setBaseDate((prev) => addDays(prev, mode === "day" ? dir : dir * 7));
  };

  const roomColor = (roomId: string) => {
    const idx = roomsSnapshot.rooms.findIndex((r) => r.id === roomId);
    return ROOM_COLORS[idx % ROOM_COLORS.length];
  };

  const label =
    mode === "day"
      ? fmtLabel(baseDate)
      : `${fmtLabel(days[0])} – ${fmtLabel(days[6])}`;

  const dayBookings = (date: Date) =>
    bookingsSnapshot.bookings
      .filter((b) => b.date === fmtDate(date))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-50 text-center">
            {label}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate(1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => setBaseDate(new Date())}
          >
            Today
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-border rounded-md overflow-hidden">
            {(["day", "week"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 text-xs  font-medium transition-colors capitalize ${
                  mode === m
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => {
              console.log("on New");
            }}
          >
            <Plus className="w-4 h-4" />
            Book
          </Button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="border border-border rounded-xl overflow-hidden">
        {/* Day headers */}
        <div
          className="grid border-border"
          style={{ gridTemplateColumns: `56px repeat(${days.length}, 1fr)` }}
        >
          <div className="border-r border-border" />
          {days.map((d) => {
            const isToday = fmtDate(d) === today;
            return (
              <div
                key={fmtDate(d)}
                className={`py-2 px-3 text-center text-xs font-medium border-r border-border last:border-r-0 ${
                  isToday ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <span
                  className={`${isToday ? "bg-primary text-primary-foreground rounded-full px-2 py-0.5" : ""}`}
                >
                  {mode === "day"
                    ? d.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })
                    : d.toLocaleDateString("en-US", {
                        weekday: "short",
                        day: "numeric",
                      })}
                </span>
              </div>
            );
          })}
        </div>

        {/* Time slots */}
        <div
          className="relative overflow-y-auto max-h-130"
          style={{ scrollbarWidth: "thin" }}
        >
          <div
            className="grid"
            style={{
              gridTemplateColumns: `56px repeat(${days.length}, 1fr)`,
              height: `${HOURS.length * CELL_HEIGHT}px`,
            }}
          >
            {/* Hour labels column */}
            <div className="relative border-r border-border">
              {HOURS.map((h) => (
                <div
                  key={h}
                  className="absolute w-full border-t border-border flex items-start justify-end pr-2 pt-0.5"
                  style={{
                    top: `${(h - 8) * CELL_HEIGHT}px`,
                    height: `${CELL_HEIGHT}px`,
                  }}
                >
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {String(h).padStart(2, "0")}:00
                  </span>
                </div>
              ))}
            </div>

            {/* Day columns */}
            {days.map((d) => {
              const dStr = fmtDate(d);
              const dBookings = dayBookings(d);
              const isToday = dStr === today;
              return (
                <div
                  key={dStr}
                  className="relative border-r border-border last:border-r-0 cursor-pointer group"
                  onClick={() => BookingStoreActions.openNew(undefined, dStr)}
                >
                  {/* Hour gridlines */}
                  {HOURS.map((h) => (
                    <div
                      key={h}
                      className="absolute w-full border-t border-border/50 group-hover:border-border transition-colors"
                      style={{
                        top: `${(h - 8) * CELL_HEIGHT}px`,
                        height: `${CELL_HEIGHT}px`,
                      }}
                    />
                  ))}

                  {/* Today indicator */}
                  {isToday &&
                    (() => {
                      const now = new Date();
                      const frac = timeToFraction(
                        `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
                      );
                      if (frac < 0 || frac > HOURS.length) return null;
                      return (
                        <div
                          className="absolute left-0 right-0 z-20 flex items-center gap-1 pointer-events-none"
                          style={{ top: `${frac * CELL_HEIGHT}px` }}
                        >
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0 -ml-1" />
                          <div className="h-px flex-1 bg-primary" />
                        </div>
                      );
                    })()}
                  {/* Booking blocks */}
                  {dBookings.map((booking) => {
                    const top = timeToFraction(booking.startTime) * CELL_HEIGHT;
                    const height =
                      (timeToFraction(booking.endTime) -
                        timeToFraction(booking.startTime)) *
                      CELL_HEIGHT;
                    // if (height <= 0) return null;
                    const room = roomsSnapshot.rooms.find(
                      (r) => r.id === booking.roomId,
                    );
                    return (
                      <div
                        key={booking.id}
                        className={`absolute left-1 right-1 rounded border px-1.5 py-1 overflow-hidden cursor-pointer hover:brightness-110 transition-all z-10 ${roomColor(booking.roomId)}`}
                        style={{
                          top: `${top}px`,
                          height: `${Math.max(height - 2, 18)}px`,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("onEdit");
                        }}
                      >
                        <p className="text-[11px] font-semibold leading-tight truncate">
                          {booking.title}
                        </p>
                        {/* {height > 28 && ( */}
                        <p className="text-[10px] opacity-80 truncate">
                          {room?.name}
                        </p>
                        {/* )} */}
                        {/* {height > 42 && ( */}
                        <p className="text-[10px] opacity-70 truncate">
                          {booking.startTime} – {booking.endTime}
                        </p>
                        {/* )} */}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Room legend */}
      <div className="flex flex-wrap gap-2">
        {roomsSnapshot.rooms.map((room, i) => (
          <span
            key={room.id}
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-medium ${ROOM_COLORS[i % ROOM_COLORS.length]}`}
          >
            {room.name}
          </span>
        ))}
      </div>
    </div>
  );
}
