import { CURRENT_USER } from "@/data/mockData";
import { RoomsStore } from "@/store/Rooms.store";
import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";

import { proxy } from "valtio";

export const bookingFormDefault: BookingForm = {
  title: "",
  roomId: "",
  date: "",
  startTime: "09:00",
  endTime: "10:00",
  attendees: [] as string[],
  notes: "",
};

export interface BookingForm {
  title: string;
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  notes: string | undefined;
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

    BookingsStore.formOpen = true;
  },
  closeForm: () => {
    BookingsStore.formOpen = false;
  },
  createBooking: (form: BookingForm) => {
    const room = RoomsStore.rooms.find((room) => room.id === form.roomId);
    // Prevent bookings in the past
    const startDateTime = new Date(`${form.date}T${form.startTime}`);
    const endDateTime = new Date(`${form.date}T${form.endTime}`);
    const now = new Date();
    console.log("STORE BOOKINGS:", BookingsStore.bookings);

    if (startDateTime < now) {
      return {
        success: false as const,
        error: "You cannot create a booking in the past.",
      };
    }

    if (endDateTime <= startDateTime) {
      return {
        success: false as const,
        error: "End time must be after start time.",
      };
    }

    // Room must exist
    if (!room) {
      return {
        success: false as const,
        error: "Selected room does not exist.",
      };
    }

    // Check room availability
    const roomConflict = BookingsStore.bookings.some((existingBooking) => {
      if (
        existingBooking.roomId !== form.roomId ||
        existingBooking.date !== form.date
      ) {
        return false;
      }

      return (
        existingBooking.startTime < form.endTime &&
        existingBooking.endTime > form.startTime
      );
    });

    if (roomConflict) {
      return {
        success: false as const,
        error: "This room is already booked during this time.",
      };
    }

    // Check room capacity
    const totalPeople = 1 + form.attendees.length;

    if (totalPeople > room.capacity) {
      return {
        success: false as const,
        error: `This room can accommodate a maximum of ${room.capacity} people.`,
      };
    }

    // Check attendee availability
    const conflictingAttendees = form.attendees.filter((attendee) =>
      BookingsStore.bookings.some((existingBooking) => {
        if (existingBooking.date !== form.date) {
          return false;
        }

        const attendeeAlreadyBooked =
          existingBooking.organizer === attendee ||
          existingBooking.attendees.includes(attendee);

        if (!attendeeAlreadyBooked) {
          return false;
        }

        return (
          existingBooking.startTime < form.endTime &&
          existingBooking.endTime > form.startTime
        );
      }),
    );

    if (conflictingAttendees.length > 0) {
      return {
        success: false as const,
        error: `The following attendee(s) are already booked: ${conflictingAttendees.join(
          ", ",
        )}`,
      };
    }

    // Everything is valid — create the booking
    const booking: Booking = {
      id: `b${Date.now()}`,
      roomId: form.roomId,
      title: form.title,
      organizer: CURRENT_USER,
      attendees: form.attendees,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      notes: form.notes || undefined,
    };

    BookingsStore.bookings.push(booking);

    return {
      success: true as const,
      booking,
    };
  },
  editBooking: (id: string, form: BookingForm) => {
    const booking = BookingsStore.bookings.find((booking) => booking.id === id);

    if (!booking) {
      return {
        success: false as const,
        error: "Booking not found.",
      };
    }

    // Prevent bookings in the past
    const startDateTime = new Date(`${form.date}T${form.startTime}`);
    const endDateTime = new Date(`${form.date}T${form.endTime}`);
    const now = new Date();

    if (startDateTime < now) {
      return {
        success: false as const,
        error: "You cannot move a booking to the past.",
      };
    }

    if (endDateTime <= startDateTime) {
      return {
        success: false as const,
        error: "End time must be after start time.",
      };
    }

    const room = RoomsStore.rooms.find((room) => room.id === form.roomId);
    if (!room) {
      return {
        success: false as const,
        error: "Selected room does not exist.",
      };
    }

    // Check room availability (exclude current booking)
    const roomConflict = BookingsStore.bookings.some((existingBooking) => {
      if (existingBooking.id === id) return false; // Skip self
      if (
        existingBooking.roomId !== form.roomId ||
        existingBooking.date !== form.date
      ) {
        return false;
      }
      return (
        existingBooking.startTime < form.endTime &&
        existingBooking.endTime > form.startTime
      );
    });

    if (roomConflict) {
      return {
        success: false as const,
        error: "This room is already booked during this time.",
      };
    }

    // Check room capacity
    const totalPeople = 1 + form.attendees.length;
    if (totalPeople > room.capacity) {
      return {
        success: false as const,
        error: `This room can accommodate a maximum of ${room.capacity} people.`,
      };
    }

    // Check attendee availability (exclude current booking)
    const conflictingAttendees = form.attendees.filter((attendee) =>
      BookingsStore.bookings.some((existingBooking) => {
        if (existingBooking.id === id) return false; // Skip self
        if (existingBooking.date !== form.date) return false;

        const attendeeAlreadyBooked =
          existingBooking.organizer === attendee ||
          existingBooking.attendees.includes(attendee);

        if (!attendeeAlreadyBooked) return false;

        return (
          existingBooking.startTime < form.endTime &&
          existingBooking.endTime > form.startTime
        );
      }),
    );

    if (conflictingAttendees.length > 0) {
      return {
        success: false as const,
        error: `The following attendee(s) are already booked: ${conflictingAttendees.join(", ")}`,
      };
    }

    // All validations passed — update the booking
    booking.title = form.title;
    booking.roomId = form.roomId;
    booking.date = form.date;
    booking.startTime = form.startTime;
    booking.endTime = form.endTime;
    booking.attendees = [...form.attendees];
    booking.notes = form.notes;

    return {
      success: true as const,
      booking,
    };
  },
  deleteBooking: (id: string) => {
    const indexToDelete = BookingsStore.bookings.findIndex(
      (item) => item.id == id,
    );
    if (indexToDelete !== -1) {
      BookingsStore.bookings.splice(indexToDelete, 1);
    }
  },
};
