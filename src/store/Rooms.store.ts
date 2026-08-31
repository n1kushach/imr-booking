import type { Room } from "@/types/room";

import { proxy } from "valtio";

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

export const RoomsStore = proxy<{
  rooms: Room[];
  search: string;
  capacityFilter: capacityFilter;
}>({
  rooms: [],
  search: "",
  capacityFilter: "any",
});
