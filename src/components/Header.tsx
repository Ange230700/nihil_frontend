// src\components\Header.tsx

import Navbar from "@nihil_frontend/components/Navbar";

export default function Header() {
  return (
    <header style={{ backgroundColor: "var(--card)", color: "var(--text)" }}>
      <Navbar />
    </header>
  );
}
