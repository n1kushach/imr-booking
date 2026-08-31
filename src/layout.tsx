import Header from "@/components/header/Header";
import Navigation from "@/components/navigation/Navigation";

import { Outlet } from "react-router";

const Layout = () => {
  return (
    <div className="min-h-full flex flex-col bg-background text-foreground">
      {/* Top nav */}
      <Navigation />
      <Header />
      <Outlet />
    </div>
  );
};

export default Layout;
