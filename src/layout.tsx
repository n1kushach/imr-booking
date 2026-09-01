import BookingForm from "@/components/BookingForm";
import Header from "@/components/header/Header";
import Navigation from "@/components/navigation/Navigation";
import { Toaster } from "@/components/ui/sonner";

import { Outlet } from "react-router";

const Layout = () => {
  return (
    <div className="min-h-full flex flex-col bg-background text-foreground">
      <Toaster />
      <Navigation />
      <Header />
      <BookingForm />
      <Outlet />
    </div>
  );
};

export default Layout;
