import { createBrowserRouter } from "react-router";
import Layout from "@/layout";
import RoomsPage from "@/pages/RoomsPage";
import BookingsPage from "@/pages/BookingsPage";
import SchedulesPage from "@/pages/SchedulesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <RoomsPage />,
      },
      {
        path: "/bookings",
        element: <BookingsPage />,
      },
      { path: "/schedule", element: <SchedulesPage /> },
    ],
  },
]);
