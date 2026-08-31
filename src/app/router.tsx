import { createBrowserRouter } from "react-router";
import App from "../App";
import Layout from "@/layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <App />,
      },
    ],
  },
]);
