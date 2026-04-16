/**
 * Header component for the admin section of the application.
 * Displays the title of the current admin page based on the URL path.
 * The title is determined using pathname.startsWith() so nested routes
 * such as /admin/squads/4/edit still show the correct section title.
 * Includes a logo on the right side of the header.
 * Uses the SidebarTrigger component to toggle the sidebar.
 */

"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Logo from "@/public/fc-zh-leutschenbach-logo.avif";

export default function AdminHeader() {
  const pathname = usePathname();

  let title = "Admin Bereich";
  if (pathname.startsWith("/admin/squads")) {
    title = "Teams Bereich";
  } else if (pathname.startsWith("/admin/players")) {
    title = "Spieler Bereich";
  } else if (pathname.startsWith("/admin/trainers")) {
    title = "Trainer Bereich";
  }

  return (
    <header className="flex items-center border-b gap-5 p-3">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="cursor-pointer" />
        <span className="text-sm text-muted-foreground md:hidden">
          Menu
        </span>{" "}
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      <Image
        src={Logo}
        alt="Logo FC Zürich-Leutschenbach"
        width={50}
        height={50}
        className="ml-auto"
      />
    </header>
  );
}
