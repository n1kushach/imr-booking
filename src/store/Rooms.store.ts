import type { Booking } from "@/types/booking";
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
  formOpen: boolean;
  editBooking: Booking | undefined;
  preselectedRoom: Room | undefined;
  preselectedDate: string | undefined;
  bookingForm: BookingForm;
}>({
  rooms: [],
  search: "",
  capacityFilter: "any",
  formOpen: false,
  editBooking: undefined,
  preselectedRoom: undefined,
  preselectedDate: undefined,
  bookingForm: {
    title: "",
    roomId: "",
    date: "",
    startTime: "09:00",
    endTime: "10:00",
    attendees: [] as string[],
    notes: "",
  },
});

export const RoomStoreActions = {
  openNew: (room?: Room, date?: string) => {
    const today = new Date().toISOString().split("T")[0];

    RoomsStore.editBooking = undefined;
    RoomsStore.preselectedRoom = room;
    RoomsStore.preselectedDate = date;

    RoomsStore.bookingForm.title = "";
    RoomsStore.bookingForm.roomId = room?.id ?? "";
    RoomsStore.bookingForm.date = date ?? today;
    RoomsStore.bookingForm.startTime = "09:00";
    RoomsStore.bookingForm.endTime = "10:00";
    RoomsStore.bookingForm.attendees = [];
    RoomsStore.bookingForm.notes = "";

    RoomsStore.formOpen = true;
  },
  openEdit: (booking: Booking) => {
    RoomsStore.editBooking = booking;

    RoomsStore.bookingForm.title = booking.title;
    RoomsStore.bookingForm.roomId = booking.roomId;
    RoomsStore.bookingForm.date = booking.date;
    RoomsStore.bookingForm.startTime = booking.startTime;
    RoomsStore.bookingForm.endTime = booking.endTime;
    RoomsStore.bookingForm.attendees = [...booking.attendees];
    RoomsStore.bookingForm.notes = booking.notes ?? "";

    RoomsStore.formOpen = true;
  },
  closeForm: () => {
    RoomsStore.formOpen = false;
  },
};
