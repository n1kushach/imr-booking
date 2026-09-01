# Internal Meeting Room Booking System

A modern web application for managing meeting room bookings within a company. Employees can view room availability, create bookings, manage their schedules, and maintain an overview of the company's meeting resources.

## 🎯 Overview

This is a fully functional internal web application built with React and TypeScript that allows employees to:

- **View & Manage Rooms**: Browse available meeting rooms with detailed information and filtering options
- **Schedule Bookings**: Create, edit, and cancel meeting room bookings with an intuitive calendar interface
- **Calendar Views**: Switch between daily and weekly schedule views to visualize room availability
- **Dashboard**: Get a quick overview of current bookings and room status
- **Search & Filter**: Easily find rooms and bookings based on relevant parameters
- **Data Persistence**: All changes automatically persist across browser sessions using localStorage

## 🛠️ Tech Stack

### Core Framework

- **React 18** with **TypeScript** - Type-safe component development
- **Vite** - Lightning-fast development server and build tool

### State Management & Data

- **Valtio** - Lightweight, flexible state management with proxy-based reactivity
- **TanStack Query (React Query)** - Server state management and data synchronization
- **Zod** - Runtime schema validation for data integrity

### UI & Scheduling

- **FullCalendar** - Powerful calendar component for daily/weekly views
- **TanStack Form** - Robust form state management with built-in validation

### Additional Libraries

- Date manipulation: `date-fns` or similar
- UI Components: Tailwind CSS / Shadcn/ui (or your chosen UI library)
- HTTP Client: `axios` or `fetch` API

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
├── pages/               # Page components
├── store/               # Valtio state management
├── services/            # API/data layer (JSON fetching)
├── types/               # TypeScript type definitions
├── validation/          # Zod schemas
├── utils/               # Utility functions
├── data/                # Initial JSON data files
│   ├── bookings.json    # Sample bookings
│   ├── rooms.json       # Sample rooms
│   └── mockData.ts      # More mock data
└── App.tsx              # Main application component
```

## 🏗️ Architecture

### Data Layer

The application abstracts data access through a service layer that mimics API calls:

```typescript
// services/api.ts - Fetches from local JSON files
export const fetchRooms = async () => {
  const response = await fetch("/data/rooms.json");
  return response.json();
};
```

This design allows for easy migration to a real backend API without UI changes.

### State Management

**Valtio** manages application state with a simple, reactive proxy:

```typescript
// store/Bookings.store.ts
export const BookingsStore = createPersistedStore<{
  bookings: Booking[];
  formOpen: boolean;
  editBooking: Booking | undefined;
  preselectedRoom: Room | undefined;
  preselectedDate: string | undefined;
  filters: {
    search: string;
    type: "all" | "mine" | "upcoming" | "past";
  };
}>(
  {
    bookings: [],
    formOpen: false,
    editBooking: undefined,
    preselectedRoom: undefined,
    preselectedDate: undefined,
    filters: {
      search: "",
      type: "upcoming",
    },
  },
  "bookings",
);
```

**TanStack Query**

- Fetching
- Loading and error states

### Form Handling

**TanStack Form** with **Zod** validation ensures data quality:

```typescript
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
```

## 📊 Features Implemented

### Dashboard

- Quick overview of upcoming bookings
- Room availability summary

### Rooms Page

- List all available meeting rooms
- Display room details (capacity, equipment, location, amenities)
- Search and filter by name, capacity, floor, amenities

### Calendar / Schedule Views

- **Daily View**: Hour-by-hour schedule for selected date
- **Weekly View**: 7-day overview of room availability
- Hover to view booking details or click to create new bookings

### Bookings Management

- **Create**: Add new bookings with full details
- **Edit**: Modify upcoming bookings
- **Cancel**: Remove bookings
- **Search & Filter**: By room, date, organizer, attendees

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/n1kushach/imr-booking.git
cd imr-booking

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build & Deployment

```bash
# Build for production
npm run build
```

## 💾 Data Persistence

The application uses **localStorage** to persist user-created and modified data:

- Initial data loads from JSON files on first visit
- All changes (new bookings, edits, cancellations) are saved to localStorage
- Data persists across browser sessions and page refreshes
- Subsequent loads check localStorage before fetching JSON files

## ⚙️ Key Design Decisions

### 1. **Valtio over Redux**

- Lighter weight and simpler API
- Proxy-based reactivity feels more natural in React
- Less boilerplate, faster development

### 2. **FullCalendar for Scheduling**

- Mature, feature-rich calendar component
- Handles complex scheduling logic
- Good accessibility and responsive design

### 4. **JSON File Fetches Instead of In-Memory Data**

- More realistic simulation of API calls
- Allows testing async data loading
- Easy to measure and mock in testing

## 🌐 Deployment

The application is deployed on **Vercel** at: https://imr-booking-git-main-nikolozi-chavchavadzes-projects.vercel.app/

### Deployment Steps

1. Push code to GitHub
2. Connect repository to Vercel
3. Vercel automatically builds and deploys on push
4. Environment variables configured in Vercel dashboard

## 🔗 Links

- **Repository**: https://github.com/n1kushach/imr-booking
- **Live Demo**: https://imr-booking-git-main-nikolozi-chavchavadzes-projects.vercel.app/
- **Assignment**: Internal Meeting Room Booking System

## 📄 License

Internal company project

## ✉️ Contact & Support

For questions or feedback about this application, contact the development team.

---
