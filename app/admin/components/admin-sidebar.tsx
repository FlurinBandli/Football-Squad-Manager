"use client";

/**
 * AdminSidebar component for the admin section of the application.
 * Displays navigation links to different admin pages.
 * Includes a logout button at the bottom of the sidebar.
 */

import LogoutButton from "@/app/admin/components/logout-button";
import { Volleyball, Users, UserStar } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

// Sidebar navigation items with labels, icons, and links
const menuItems = [
  { label: "Teams", icon: Volleyball, href: "/admin/squads" },
  { label: "Spieler", icon: Users, href: "/admin/players" },
  { label: "Trainer", icon: UserStar, href: "/admin/trainers" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {/* Navigation menu items */}
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label} className="mt-5">
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "flex items-center gap-5",
                      pathname === item.href &&
                        "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    )}
                  >
                    <Link
                      href={item.href}
                      onClick={() => {
                        if (isMobile) setOpenMobile(false);
                      }}
                      className="flex items-center gap-5"
                    >
                      <span className="w-6 h-6">
                        <item.icon />
                      </span>
                      <span className="text-2xl">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer of the sidebar containing the logout button */}
      <SidebarFooter className="mb-16">
        <SidebarMenu>
          <SidebarMenuItem>
            <LogoutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
