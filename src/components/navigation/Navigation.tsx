import { CURRENT_USER } from "@/data/mockData";
import { BookingsStore } from "@/store/Bookings.store";
import type { View } from "@/types/view";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  LayoutGrid,
  List,
  Menu,
  User,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useSnapshot } from "valtio";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingsSnapshot = useSnapshot(BookingsStore);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const todayBookings = bookingsSnapshot.bookings.filter(
    (b) => b.date === new Date().toISOString().split("T")[0],
  );

  const navItems: {
    id: View;
    label: string;
    icon: React.ReactNode;
    href: string;
  }[] = [
    {
      id: "rooms",
      label: "Rooms",
      icon: <LayoutGrid className="w-4 h-4" />,
      href: "/",
    },
    {
      id: "schedule",
      label: "Schedule",
      icon: <CalendarDays className="w-4 h-4" />,
      href: "/schedule",
    },
    {
      id: "bookings",
      label: "Bookings",
      icon: <List className="w-4 h-4" />,
      href: "/bookings",
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between h-14 md:h-16">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <CalendarDays className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm tracking-tight hidden xs:inline">
              Meeting Room Booking
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.href);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  location.pathname === item.href
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button className="relative h-9 w-9 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Bell className="w-4 h-4" />
              {todayBookings.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                  {todayBookings.length > 9 ? "9+" : todayBookings.length}
                </span>
              )}
            </button>

            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-muted cursor-pointer transition-colors">
              <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground truncate max-w-30">
                {CURRENT_USER}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            </div>

            <button className="md:hidden h-9 w-9 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <User className="w-3 h-3 text-primary" />
              </div>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <nav className="px-3 py-2 flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.href);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors w-full ${
                    location.pathname === item.href
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
        )}
      </header>
    </>
  );
};

export default Navigation;
