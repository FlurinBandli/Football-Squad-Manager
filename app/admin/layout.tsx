/**
 * Layout for the admin section of the application.
 * This layout includes a sidebar for navigation and a main content area
 *  where the currently selected admin page will be rendered.
 */

import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import AdminSidebar from "@/app/admin/components/admin-sidebar";
import AdminHeader from "@/app/admin/components/admin-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AdminSidebar />
          <main className="flex-1">
            <AdminHeader />
            {/* Main content area where the selected admin page will be rendered */}
            {children}
          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
