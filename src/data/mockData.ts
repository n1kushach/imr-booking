import type { Booking } from "../types/booking";
import type { Room } from "../types/room";

export const ROOMS: Room[] = [
  {
    id: "r1",
    name: "Atlas",
    capacity: 12,
    floor: 4,
    amenities: ["Projector", "Whiteboard", "Video Conferencing", "WiFi"],
    imageUrl:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=340&fit=crop&auto=format",
  },
  {
    id: "r2",
    name: "Meridian",
    capacity: 6,
    floor: 4,
    amenities: ["TV Screen", "Whiteboard", "WiFi"],
    imageUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=340&fit=crop&auto=format",
  },
  {
    id: "r3",
    name: "Summit",
    capacity: 20,
    floor: 5,
    amenities: [
      "Projector",
      "Whiteboard",
      "Video Conferencing",
      "WiFi",
      "Phone",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=340&fit=crop&auto=format",
  },
  {
    id: "r4",
    name: "Solstice",
    capacity: 4,
    floor: 3,
    amenities: ["TV Screen", "WiFi"],
    imageUrl:
      "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=600&h=340&fit=crop&auto=format",
  },
  {
    id: "r5",
    name: "Zenith",
    capacity: 8,
    floor: 5,
    amenities: ["Projector", "Whiteboard", "WiFi", "Phone"],
    imageUrl:
      "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=600&h=340&fit=crop&auto=format",
  },
  {
    id: "r6",
    name: "Horizon",
    capacity: 16,
    floor: 3,
    amenities: [
      "Projector",
      "Whiteboard",
      "Video Conferencing",
      "WiFi",
      "Phone",
      "Coffee Station",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&h=340&fit=crop&auto=format",
  },
];

const today = new Date();
const fmt = (d: Date) => d.toISOString().split("T")[0];
const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "b1",
    roomId: "r1",
    title: "Q3 Planning Session",
    organizer: "Sarah Chen",
    attendees: ["Marcus Webb", "Priya Nair", "Tom Okafor", "Lena Bauer"],
    date: fmt(today),
    startTime: "09:00",
    endTime: "10:30",
    notes: "Bring printed roadmap docs",
  },
  {
    id: "b2",
    roomId: "r3",
    title: "All-Hands Engineering",
    organizer: "James Ruiz",
    attendees: ["Full Engineering Team"],
    date: fmt(today),
    startTime: "11:00",
    endTime: "12:00",
  },
  {
    id: "b3",
    roomId: "r2",
    title: "Design Review",
    organizer: "Lena Bauer",
    attendees: ["Sarah Chen", "Marcus Webb"],
    date: fmt(today),
    startTime: "14:00",
    endTime: "15:00",
  },
  {
    id: "b4",
    roomId: "r5",
    title: "Sprint Retrospective",
    organizer: "Tom Okafor",
    attendees: ["Backend Team"],
    date: fmt(addDays(today, 1)),
    startTime: "10:00",
    endTime: "11:30",
  },
  {
    id: "b5",
    roomId: "r1",
    title: "Investor Briefing Prep",
    organizer: "Sarah Chen",
    attendees: ["James Ruiz", "Priya Nair"],
    date: fmt(addDays(today, 1)),
    startTime: "13:00",
    endTime: "14:30",
  },
  {
    id: "b6",
    roomId: "r6",
    title: "Product Roadmap Review",
    organizer: "Priya Nair",
    attendees: ["Full Product Team"],
    date: fmt(addDays(today, 2)),
    startTime: "09:30",
    endTime: "11:00",
  },
  {
    id: "b7",
    roomId: "r4",
    title: "1:1 — Engineering Leads",
    organizer: "James Ruiz",
    attendees: ["Tom Okafor"],
    date: fmt(addDays(today, 2)),
    startTime: "15:00",
    endTime: "15:30",
  },
  {
    id: "b8",
    roomId: "r2",
    title: "UX Research Sync",
    organizer: "Lena Bauer",
    attendees: ["Marcus Webb", "External Researcher"],
    date: fmt(addDays(today, 3)),
    startTime: "11:00",
    endTime: "12:00",
  },
];

export const EMPLOYEES = [
  "Sarah Chen",
  "Marcus Webb",
  "Priya Nair",
  "Tom Okafor",
  "Lena Bauer",
  "James Ruiz",
  "Diana Park",
  "Alex Kowalski",
  "Yusuf Al-Amin",
  "Chloe Reyes",
];

export const CURRENT_USER = "Sarah Chen";
