"use client";

import { useEffect, useMemo, useState } from "react";
import { Lock, LockOpen, Search } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import DashboardHeaders from "@/components/dashboardheaders";
import { ModeToggle } from "@/components/mode-toggle";

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [updatingId, setUpdatingId] = useState(null);

  // ========================================
  // FETCH USERS
  // ========================================

  async function fetchUsers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/users");

      const text = await response.text();

      let data = [];

      if (text) {
        data = JSON.parse(text);
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch members");
      }

      setUsers(data);
    } catch (error) {
      console.error("FETCH USERS ERROR:", error);

      setError(error.message || "Failed to fetch members");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  // ========================================
  // SEARCH + FILTER
  // ========================================

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName =
        `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();

      const matchesSearch = fullName.includes(search.toLowerCase().trim());

      const matchesStatus =
        statusFilter === "ALL" || user.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  // ========================================
  // SUSPEND / UNSUSPEND
  // ========================================

  async function handleStatusChange(user) {
    const newStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

    try {
      setUpdatingId(user.id);
      setError("");

      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const text = await response.text();

      let data = {};

      if (text) {
        data = JSON.parse(text);
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to update user status");
      }

      // Update the table immediately
      setUsers((previousUsers) =>
        previousUsers.map((currentUser) =>
          currentUser.id === user.id
            ? {
                ...currentUser,
                status: newStatus,
              }
            : currentUser,
        ),
      );
    } catch (error) {
      console.error("UPDATE USER STATUS ERROR:", error);

      setError(error.message || "Failed to update user status");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="p-6">
      <DashboardHeaders
        title="User Management"
        description="View and manage registered OurTribe members."
        ModeToggle={ModeToggle}
      />

      <Separator />

      {/* ERROR */}

      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* SEARCH + FILTER */}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name..."
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>

            <SelectItem value="ACTIVE">Active</SelectItem>

            <SelectItem value="SUSPENDED">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* TABLE */}

      <div className="mt-6 overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-4 py-4 text-left text-sm font-medium">ID</th>

                <th className="px-4 py-4 text-left text-sm font-medium">
                  First Name
                </th>

                <th className="px-4 py-4 text-left text-sm font-medium">
                  Last Name
                </th>

                <th className="px-4 py-4 text-left text-sm font-medium">
                  Phone Number
                </th>

                <th className="px-4 py-4 text-left text-sm font-medium">
                  Email
                </th>

                <th className="px-4 py-4 text-left text-sm font-medium">
                  Date Registered
                </th>

                <th className="px-4 py-4 text-left text-sm font-medium">
                  Status
                </th>

                <th className="px-4 py-4 text-center text-sm font-medium">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    Loading members...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    No members found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user.id} className="border-b last:border-0">
                    <td className="px-4 py-4 text-sm">{index + 1}</td>

                    <td className="px-4 py-4 text-sm">{user.firstName}</td>

                    <td className="px-4 py-4 text-sm">{user.lastName}</td>

                    <td className="px-4 py-4 text-sm">{user.phone}</td>

                    <td className="px-4 py-4 text-sm">{user.email}</td>

                    <td className="px-4 py-4 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          user.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status === "ACTIVE" ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={updatingId === user.id}
                          onClick={() => handleStatusChange(user)}
                          title={
                            user.status === "ACTIVE"
                              ? "Suspend user"
                              : "Unsuspend user"
                          }
                        >
                          {user.status === "ACTIVE" ? (
                            <LockOpen className="h-5 w-5 text-green-600" />
                          ) : (
                            <Lock className="h-5 w-5 text-red-600" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
