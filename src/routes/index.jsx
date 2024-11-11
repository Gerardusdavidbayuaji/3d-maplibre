import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ModelSempor from "@/pages/sempor";
import ModelSermo from "@/pages/sermo";

export default function Router() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <ModelSempor />,
    },
    {
      path: "/sermo",
      element: <ModelSermo />,
    },
  ]);

  return <RouterProvider router={router} />;
}
