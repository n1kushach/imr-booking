import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookingStoreActions } from "@/store/Bookings.store";
import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";
import {
  Coffee,
  MapPin,
  Monitor,
  Phone,
  Presentation,
  Users,
  Wifi,
} from "lucide-react";

const amenityIcon = (a: string) => {
  if (a === "WiFi") return <Wifi className="w-3 h-3" />;
  if (a === "Phone") return <Phone className="w-3 h-3" />;
  if (a === "Coffee Station") return <Coffee className="w-3 h-3" />;
  if (a.includes("Projector")) return <Presentation className="w-3 h-3" />;
  return <Monitor className="w-3 h-3" />;
};

interface IRoom {
  room: Room;
  busy: boolean;
  todayBookings: Booking[];
}

const CRoom = (props: IRoom) => {
  const { room, busy, todayBookings } = props;
  return (
    <Card
      key={room.id}
      className="overflow-hidden h-100 pt-0! gap-0! hover:border-primary/30 transition-colors group"
    >
      <div className="relative h-[50%] overflow-hidden bg-muted">
        <img
          src={room.imageUrl}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <h3 className="text-white font-semibold text-lg leading-none">
            {room.name}
          </h3>
          <Badge
            variant={busy ? "destructive" : "default"}
            className="text-[10px]"
          >
            {busy ? "In Use" : "Available"}
          </Badge>
        </div>
      </div>

      <CardContent className="pt-4 h-[50%] flex flex-col justify-between">
        <div className="top">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              {room.capacity} seats
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Floor {room.floor}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-2">
            {room.amenities.map((a) => (
              <span
                key={a}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[11px] font-medium"
              >
                {amenityIcon(a)}
                {a}
              </span>
            ))}
          </div>
        </div>
        <div className="bottom flex flex-col gap-2">
          <div className="text-xs text-muted-foreground border-t border-border pt-2">
            <span className="font-medium text-foreground">
              {todayBookings.length}
            </span>{" "}
            booking
            {todayBookings.length > 1 ? "s" : ""} today
          </div>

          <Button
            size="sm"
            className="w-full"
            onClick={() => BookingStoreActions.openNew(room)}
          >
            Book {room.name}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CRoom;
