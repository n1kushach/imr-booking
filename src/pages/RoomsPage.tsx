import RoomsView from "@/components/RoomsView";
import { useRooms } from "@/services/api";
import { toast } from "sonner";

const RoomsPage = () => {
  const { isLoading: isRoomsLoading, isError: isRoomsError } = useRooms();

  if (isRoomsError) {
    toast.error("Failed to fetch");
  }

  return <RoomsView isError={isRoomsError} isLoading={isRoomsLoading} />;
};

export default RoomsPage;
