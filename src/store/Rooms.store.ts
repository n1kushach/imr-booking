import type { Room } from "@/types/room";
import { createPersistedStore } from "@/utils/valtio-persist";

export type capacityFilter = "any" | "small" | "medium" | "large";
export interface BookingForm {
  title: string;
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  notes: string;
}

export const RoomsStore = createPersistedStore<{
  rooms: Room[];
  search: string;
  capacityFilter: capacityFilter;
}>(
  {
    rooms: [],
    search: "",
    capacityFilter: "any",
  },
  "rooms",
);
