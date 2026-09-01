import { createBrowserRouter } from "react-router";
import Layout from "@/layout";
import RoomsPage from "@/pages/RoomsPage";
import BookingsPage from "@/pages/BookingsPage";

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
    ],
  },
]);
