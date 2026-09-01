import RoomsView from "@/components/rooms-view/RoomsView";
import { useRooms } from "@/services/api";
import { RoomsStore } from "@/store/Rooms.store";
import { toast } from "sonner";
import { useSnapshot } from "valtio";

const RoomsPage = () => {
  const { isLoading: isRoomsLoading, isError: isRoomsError } = useRooms();
  const snapshot = useSnapshot(RoomsStore) as typeof RoomsStore;

  if (isRoomsError) {
    toast.error("Failed to fetch");
  }

  return (
    <RoomsView
      isError={isRoomsError}
      isLoading={isRoomsLoading && snapshot.rooms.length === 0}
    />
  );
};

export default RoomsPage;
