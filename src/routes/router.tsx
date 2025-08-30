// src\routes\router.tsx

import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@nihil_frontend/routes/RootLayout";
import RootErrorBoundary from "@nihil_frontend/routes/RootErrorBoundary";
import Home from "@nihil_frontend/pages/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RootErrorBoundary />,
    children: [
      { index: true, element: <Home /> },
      { path: "*", element: <div className="p-4">Not Found</div> },
    ],
  },
]);
