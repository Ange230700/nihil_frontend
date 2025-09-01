// src\routes\RootLayout.tsx

import { Outlet, ScrollRestoration } from "react-router-dom";
import Header from "@nihil_frontend/components/Header";
import Footer from "@nihil_frontend/components/Footer";
import SessionExpiredListener from "@nihil_frontend/app/bootstrap/SessionExpiredListener";

export default function RootLayout() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col p-4">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
      <SessionExpiredListener />
    </>
  );
}
