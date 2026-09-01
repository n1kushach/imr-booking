import { useSnapshot } from "valtio";
import { RoomsStore } from "@/store/Rooms.store";
import CRoom from "@/components/room/CRoom";
import CRoomFilter from "@/components/room/CRoomFilter";
import CRoomSkeleton from "@/components/room/CRoom.skeleton";
import { BookingsStore } from "@/store/Bookings.store";

interface IRoomsView {
  isLoading: boolean;
  isError: boolean;
}

const RoomsView = (props: IRoomsView) => {
  const { isLoading, isError } = props;
  const bookingsSnapshot = useSnapshot(BookingsStore) as typeof BookingsStore;
  const roomsSnapshot = useSnapshot(RoomsStore) as typeof RoomsStore;
  const today = new Date().toISOString().split("T")[0];
  const now = new Date();
  const nowTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const isRoomBusy = (roomId: string) => {
    return bookingsSnapshot.bookings.some(
      (b) =>
        b.roomId === roomId &&
        b.date === today &&
        b.startTime <= nowTime &&
        b.endTime > nowTime,
    );
  };

  const filtered = roomsSnapshot.rooms?.filter((r) => {
    const matchSearch = r.name
      .toLowerCase()
      .includes(roomsSnapshot.search.toLowerCase());
    const matchCap =
      roomsSnapshot.capacityFilter === "any" ||
      (roomsSnapshot.capacityFilter === "small" && r.capacity <= 4) ||
      (roomsSnapshot.capacityFilter === "medium" &&
        r.capacity > 4 &&
        r.capacity <= 10) ||
      (roomsSnapshot.capacityFilter === "large" && r.capacity > 10);
    return matchSearch && matchCap;
  });

  return (
    <div className="space-y-6">
      <CRoomFilter />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 h-full">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <CRoomSkeleton key={index} />
            ))
          : filtered.map((room) => {
              const busy = isRoomBusy(room.id);

              const todayBookings = bookingsSnapshot.bookings.filter(
                (b) => b.roomId === room.id && b.date === today,
              );

              return (
                <CRoom
                  key={room.id}
                  room={room}
                  busy={busy}
                  todayBookings={todayBookings}
                />
              );
            })}
      </div>

      {filtered.length === 0 && isLoading !== true && isError == false && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-sm">No rooms match your filters.</p>
        </div>
      )}
    </div>
  );
};

export default RoomsView;
