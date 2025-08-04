// src\components\Navbar.tsx

import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import type { MenuItem } from "primereact/menuitem";
import { Button } from "primereact/button";
import useTheme from "@nihil_frontend/hooks/useTheme";
import type { ChangeEvent } from "react";

export interface NavbarProps {
  title: string;
  onTitleChange: (newValue: string) => void;
}

type NavbarMenuItem = MenuItem & {
  label?: string;
  icon?: number | string;
  command?: () => void;
};

export default function Navbar({
  title,
  onTitleChange,
}: Readonly<NavbarProps>) {
  const { theme, toggle } = useTheme();

  const items: NavbarMenuItem[] = [];

  const start = <div>stuff</div>;

  const end = (
    <section className="align-items-center flex gap-2">
      <InputText
        value={title}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          onTitleChange(e.currentTarget.value);
        }}
        placeholder="Search"
        type="text"
        className="w-8rem sm:w-auto"
      />
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
