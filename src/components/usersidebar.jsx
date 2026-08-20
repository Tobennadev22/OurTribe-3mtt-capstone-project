"use client";

import { signOut } from "next-auth/react";

import {
  LayoutDashboard,
  User,
  Calendar,
  Settings,
  LogOut,
  Megaphone,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";

const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  // {
  //   title: "User Management",
  //   url: "/admin/usermanagement",
  //   icon: User,
  // },
  {
    title: "Event Management",
    url: "/admin/eventmanagement",
    icon: Calendar,
  },
  {
    title: "Announcements",
    url: "/admin/announcement",
    icon: Megaphone,
  },
  {
    title: "Settings",
    url: "/admin/settingspage",
    icon: Settings,
  },
];

export function UserSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r bg-white">
      <SidebarHeader className="border-b px-6 py-6">
        <h1 className="text-2xl font-bold tracking-tight text-green-700">
          OurTribe
        </h1>
      </SidebarHeader>

      <SidebarContent className="px-3 py-6">
        <SidebarMenu>
          {items.map((item) => {
            const active = pathname === item.url;

            return (
              <SidebarMenuItem key={item.title} className="mb-1">
                <SidebarMenuButton
                  className={`h-8 rounded-sm transition-all ${
                    active
                      ? "bg-lime-600 text-white hover:bg-lime-100"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />

                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <Button
          className="flex w-full items-center gap-3 rounded-lg p-3 text-red-500 transition hover:bg-red-50"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
