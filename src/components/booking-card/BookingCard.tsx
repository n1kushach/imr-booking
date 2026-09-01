import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CURRENT_USER } from "@/data/mockData";
import { BookingStoreActions } from "@/store/Bookings.store";
import { RoomsStore } from "@/store/Rooms.store";
import type { Booking } from "@/types/booking";
import { Calendar, Clock, Pencil, Trash2, Users } from "lucide-react";
import { useSnapshot } from "valtio";

interface IBookingCard {
  booking: Booking;
}

const now = new Date();
const todayStr = now.toISOString().split("T")[0];
const nowTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

const isPast = (b: Booking) =>
  b.date < todayStr || (b.date === todayStr && b.endTime <= nowTime);

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

const BookingCard = (props: IBookingCard) => {
  const roomsSnapshot = useSnapshot(RoomsStore) as typeof RoomsStore;
  const { booking } = props;
  const isMine = booking.organizer === CURRENT_USER;
  const past = isPast(booking);
  const getRoom = (roomId: string) =>
    roomsSnapshot.rooms.find((r) => r.id === roomId);

  const room = getRoom(booking.roomId);

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
                <Badge variant="default" className="text-[10px] shrink-0">
                  Organizer
                </Badge>
              )}
              {past && (
                <Badge variant="outline" className="text-[10px] shrink-0">
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
                onClick={() => BookingStoreActions.deleteBooking(booking.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
