import { CURRENT_USER } from "@/data/mockData";
import { BookingsStore } from "@/store/Bookings.store";
import { ViewStore } from "@/store/View.store";
import type { View } from "@/types/view";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  LayoutGrid,
  List,
  User,
} from "lucide-react";
import React from "react";
import { useSnapshot } from "valtio";

const Navigation = () => {
  const viewSnapshot = useSnapshot(ViewStore);
  const bookingsSnapshot = useSnapshot(BookingsStore);

  const todayBookings = bookingsSnapshot.bookings.filter(
    (b) => b.date === new Date().toISOString().split("T")[0],
  );
  const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: "rooms", label: "Rooms", icon: <LayoutGrid className="w-4 h-4" /> },
    {
      id: "schedule",
      label: "Schedule",
      icon: <CalendarDays className="w-4 h-4" />,
    },
    { id: "bookings", label: "Bookings", icon: <List className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <CalendarDays className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm tracking-tight">
              Meeting Room Booking
            </span>
          </div>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => (ViewStore.view = item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewSnapshot.view === item.id
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <Bell className="w-4 h-4" />
            {todayBookings.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                {todayBookings.length}
              </span>
            )}
          </button>
          <div className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted cursor-pointer transition-colors">
            <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground hidden sm:block">
              {CURRENT_USER}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
