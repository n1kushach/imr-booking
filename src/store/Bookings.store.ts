import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";

import { proxy } from "valtio";
export interface BookingForm {
  title: string;
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  notes: string;
}

export const BookingsStore = proxy<{
  bookings: Booking[];
  formOpen: boolean;
  editBooking: Booking | undefined;
  preselectedRoom: Room | undefined;
  preselectedDate: string | undefined;
  bookingForm: BookingForm;
}>({
  bookings: [],
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

export const BookingStoreActions = {
  openNew: (room?: Room, date?: string) => {
    const today = new Date().toISOString().split("T")[0];

    BookingsStore.editBooking = undefined;
    BookingsStore.preselectedRoom = room;
    BookingsStore.preselectedDate = date;

    BookingsStore.bookingForm.title = "";
    BookingsStore.bookingForm.roomId = room?.id ?? "";
    BookingsStore.bookingForm.date = date ?? today;
    BookingsStore.bookingForm.startTime = "09:00";
    BookingsStore.bookingForm.endTime = "10:00";
    BookingsStore.bookingForm.attendees = [];
    BookingsStore.bookingForm.notes = "";

    BookingsStore.formOpen = true;
  },
  openEdit: (booking: Booking) => {
    BookingsStore.editBooking = booking;

    BookingsStore.bookingForm.title = booking.title;
    BookingsStore.bookingForm.roomId = booking.roomId;
    BookingsStore.bookingForm.date = booking.date;
    BookingsStore.bookingForm.startTime = booking.startTime;
    BookingsStore.bookingForm.endTime = booking.endTime;
    BookingsStore.bookingForm.attendees = [...booking.attendees];
    BookingsStore.bookingForm.notes = booking.notes ?? "";

    BookingsStore.formOpen = true;
  },
  closeForm: () => {
    BookingsStore.formOpen = false;
  },
  onSave: () => {
    const form = BookingsStore.bookingForm;

    if (BookingsStore.editBooking) {
      // Edit existing booking
      const index = BookingsStore.bookings.findIndex(
        (booking) => booking.id === BookingsStore.editBooking?.id,
      );

      if (index !== -1) {
        BookingsStore.bookings[index] = {
          ...BookingsStore.bookings[index],
          title: form.title,
          roomId: form.roomId,
          date: form.date,
          startTime: form.startTime,
          endTime: form.endTime,
          attendees: [...form.attendees],
          notes: form.notes,
        };
      }
    } else {
      // Create new booking
      const newBooking: Booking = {
        id: `b${BookingsStore.bookings.length + 1}`,
        title: form.title,
        roomId: form.roomId,
        organizer: "Current User",
        attendees: [...form.attendees],
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        notes: form.notes,
      };

      BookingsStore.bookings.push(newBooking);
    }

    BookingsStore.formOpen = false;
    BookingsStore.editBooking = undefined;
  },
};
