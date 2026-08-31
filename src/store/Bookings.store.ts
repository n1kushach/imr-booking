import { INITIAL_BOOKINGS } from "@/data/mockData";
import type { Booking } from "@/types/booking";

import { proxy } from "valtio";

export const BookingsStore = proxy<{ bookings: Booking[] }>({
  bookings: INITIAL_BOOKINGS,
});
