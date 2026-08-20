import { UserSidebar } from "@/components/usersidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function UserLayout({ children }) {
  const session = await getServerSession(authOptions);

  // Not logged in
  if (!session) {
    redirect("/login");
  }

  // Logged in but not a regular user
  if (session.user.role !== "USER") {
    redirect("/admin");
  }

  return (
    <SidebarProvider>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
