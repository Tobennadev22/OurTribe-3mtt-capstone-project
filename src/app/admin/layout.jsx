import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

import { AdminSidebar } from "@/components/adminsidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/user");
  }
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
