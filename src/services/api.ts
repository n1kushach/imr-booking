import { RoomsStore } from "@/store/Rooms.store";
import type { Room } from "@/types/room";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

async function fetchRooms(): Promise<Room[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const response = await fetch("/src/data/rooms.json");
  if (!response.ok) throw new Error("Failed to fetch rooms");
  return response.json();
}

export function useRooms() {
  const query = useQuery({
    queryKey: ["rooms"],
    queryFn: fetchRooms,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.data) {
      RoomsStore.rooms = query.data;
    }
  }, [query.data]);

  return query;
}
