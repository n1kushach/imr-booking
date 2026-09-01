import { BookingsStore } from "@/store/Bookings.store";
import { RoomsStore } from "@/store/Rooms.store";
import type { Booking } from "@/types/booking";
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
    retry: false,
  });

  useEffect(() => {
    if (query.data) {
      RoomsStore.rooms = query.data;
    }
  }, [query.data]);

  return query;
}

async function fetchBookings(): Promise<Booking[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const response = await fetch("/src/data/bookings.json");
  if (!response.ok) throw new Error("Failed to fetch bookings");
  return response.json();
}

export function useBookings() {
  const query = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  useEffect(() => {
    if (query.data && BookingsStore.bookings.length === 0) {
      BookingsStore.bookings = query.data;
    }
  }, [query.data]);

  return query;
}
