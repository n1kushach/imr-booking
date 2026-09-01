import * as z from "zod";

export const bookingSchema = z
  .object({
    title: z.string().trim().min(2).max(100),
    roomId: z.string().min(1, "Select a room"),
    date: z.string().min(1, "Select a date"),
    startTime: z.string(),
    endTime: z.string(),
    attendees: z.array(z.string()),
    notes: z.string().max(500),
  })
  .refine((data) => data.endTime > data.startTime, {
    path: ["endTime"],
    message: "End time must be after start time",
  });
