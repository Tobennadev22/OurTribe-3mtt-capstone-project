"use client";

import { useEffect, useState } from "react";
import { EllipsisVertical } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { TableUi } from "@/components/table";
import DashboardHeaders from "@/components/dashboardheaders";
import { ModeToggle } from "@/components/mode-toggle";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    try {
      const response = await fetch("/api/admin/users");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      const formattedUsers = data.map((user, index) => ({
        ID: index + 1,
        firstName: user.firstName,
        lastName: user.lastName,
        phone_Number: user.phone,
        email: user.email,
        dateRegistered: new Date(user.createdAt).toLocaleDateString(),

        // IMPORTANT:
        // Pass a plain string instead of the Lucide component.
        action: "•••",

        // Keep original database ID for later
        userId: user.id,
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <DashboardHeaders
        title="User Management"
        description="View and manage registered members"
        ModeToggle={ModeToggle}
      />

      <Separator />

      {loading ? (
        <div className="mt-8 text-sm text-muted-foreground">
          Loading members...
        </div>
      ) : (
        <TableUi data={users} />
      )}
    </div>
  );
}
