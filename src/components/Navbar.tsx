// src/components/Navbar.tsx

import { Menubar } from "primereact/menubar";
import type { MenuItem } from "primereact/menuitem";
import { Button } from "primereact/button";
import useTheme from "@nihil_frontend/hooks/useTheme";
import LocaleSwitcher from "@nihil_frontend/components/LocaleSwitcher";

// Remove NavbarProps
type NavbarMenuItem = MenuItem & {
  label?: string;
  icon?: number | string;
  command?: () => void;
};

export default function Navbar() {
  // Destructure title/onTitleChange from props, or use whatever you want
  const { theme, toggle } = useTheme();

  const items: NavbarMenuItem[] = [];

  const start = <div>stuff</div>;

  const end = (
    <section className="align-items-center flex gap-2">
      <LocaleSwitcher />
      <Button
        icon={theme === "dark" ? "pi pi-sun" : "pi pi-moon"}
        rounded
        aria-label="Toggle theme"
        onClick={toggle}
      />
    </section>
  );

  return (
    <nav className="card mb-4 shadow-md">
      <Menubar model={items} start={start} end={end} />
    </nav>
  );
}
