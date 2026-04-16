"use client";
/**
 * Client-side logout button component that uses NextAuth's signOut function.
 * When clicked, it logs the user out and redirects them to the login page.
 */

import { signOut } from "next-auth/react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <SidebarMenuButton
      className="cursor-pointer bg-black text-white hover:bg-black/90 hover:text-white/90
      flex items-center justify-center gap-2 h-10 rounded-md"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      <LogOut className="w-4 h-4" />
      <span className="text-base">Logout</span>
    </SidebarMenuButton>
  );
}
