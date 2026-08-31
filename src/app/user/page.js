"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  CalendarDays,
  CalendarCheck,
  Megaphone,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import MemberEvents from "@/components/member-events";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ArchivedEvents from "@/components/user-events/ArchivedEvents";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function UserDashboard() {
  const [announcements, setAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

  const [eventList, setEventList] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession();

  const [error, setError] = useState("");
  const [eventError, setEventError] = useState("");

  const [activeTab, setActiveTab] = useState("dashboard");
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  function handleTabChange(value) {
    if (value === "logout") {
      setLogoutConfirmOpen(true);
      return;
    }

    setActiveTab(value);
  }

  // =======================================
  // FETCH EVENTS
  // ========================================

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      setLoading(true);
      setEventError("");

      const response = await fetch("/api/events", {
        method: "GET",
        cache: "no-store",
      });

      const text = await response.text();

      let data = [];

      if (text) {
        data = JSON.parse(text);
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch events");
      }

      setEventList(data);
    } catch (error) {
      console.error("FETCH EVENTS ERROR:", error);
      setEventError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // ========================================
  // FETCH ANNOUNCEMENTS
  // ========================================

  async function fetchAnnouncements() {
    try {
      setLoadingAnnouncements(true);
      setError("");

      const response = await fetch("/api/announcements");

      const text = await response.text();

      let data = [];

      if (text) {
        data = JSON.parse(text);
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch announcements");
      }

      setAnnouncements(data);
    } catch (error) {
      console.error("FETCH ANNOUNCEMENTS ERROR:", error);

      setError(error.message || "Failed to fetch announcements");
    } finally {
      setLoadingAnnouncements(false);
    }
  }

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}

      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div>
            <h1 className="text-lg font-semibold">OurTribe</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
              <User className="h-4 w-4" />
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-medium">
                {status === "loading"
                  ? "Loading..."
                  : session?.user?.email || "Member"}
              </p>

              <p className="text-xs text-muted-foreground">Member</p>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold">Welcome to your dashboard</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Stay updated with what's happening in the OurTribe community.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="flex w-full justify-start gap-8 overflow-x-auto">
            <TabsTrigger
              value="dashboard"
              className="h-auto flex-none py-1.5 sm:h-[calc(100%-1px)] sm:py-0.5"
            >
              <User className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>

            <TabsTrigger
              value="events"
              className="h-auto flex-none py-1.5 sm:h-[calc(100%-1px)] sm:py-0.5"
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              Events
            </TabsTrigger>

            <TabsTrigger
              value="archived"
              className="h-auto flex-none py-1.5 sm:h-[calc(100%-1px)] sm:py-0.5"
            >
              <CalendarCheck className="mr-2 h-4 w-4" />
              Archived Events
            </TabsTrigger>

            <TabsTrigger
              value="announcements"
              className="h-auto flex-none py-1.5 sm:h-[calc(100%-1px)] sm:py-0.5"
            >
              <Megaphone className="mr-2 h-4 w-4" />
              Announcements
            </TabsTrigger>

            <TabsTrigger
              value="settings"
              className="h-auto flex-none py-1.5 sm:h-[calc(100%-1px)] sm:py-0.5"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>

            <TabsTrigger
              value="logout"
              className="h-auto flex-none py-1.5 text-red-600 hover:text-red-600 sm:h-[calc(100%-1px)] sm:py-0.5"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <MemberEvents />
          </TabsContent>

          <TabsContent value="archived" className="mt-6">
            <ArchivedEvents />
          </TabsContent>

          <Separator className="my-6" />

          {/* ========================================
              DASHBOARD
          ======================================== */}

          <TabsContent value="dashboard">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Announcements</CardTitle>

                  <CardDescription>
                    Latest community announcements.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="text-3xl font-bold">
                    {announcements.length}
                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Available announcements
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Events</CardTitle>

                  <CardDescription>Upcoming OurTribe events.</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="text-3xl font-bold">{eventList.length}</div>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Upcoming events
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Account</CardTitle>

                  <CardDescription>
                    Manage your account information.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Your profile and password can be managed from Settings.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ========================================
              EVENTS
          ======================================== */}

          <TabsContent value="events">
            {/* <Card>
              <CardHeader>
                <CardTitle>Events</CardTitle>

                <CardDescription>
                  Upcoming events from OurTribe.
                </CardDescription>
              </CardHeader>

              <CardContent>
                {error && (
                  <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {loading ? (
                  <div className="flex min-h-40 items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                      Loading events...
                    </p>
                  </div>
                ) : eventList.length === 0 ? (
                  <div className="flex min-h-40 items-center justify-center">
                    <div className="text-center">
                      <Megaphone className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />

                      <p className="text-sm font-medium">
                        No announcements yet
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Check back later for updates.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {eventList.map((events) => (
                      <div key={events.id} className="rounded-lg border p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="font-semibold">{events.title}</h3>

                            <p className="mt-1 text-xs text-muted-foreground">
                              Posted{" "}
                              {new Date(events.createdAt).toLocaleDateString()}
                            </p>
                          </div>

                          <Badge variant="secondary">events</Badge>
                        </div>

                        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                          {events.description}
                        </p>

                        {events.createdBy && (
                          <div className="mt-4 border-t pt-3 text-xs text-muted-foreground">
                            Posted by{" "}
                            <span className="font-medium text-foreground">
                              {events.createdBy.firstName}{" "}
                              {events.createdBy.lastName}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card> */}
          </TabsContent>

          {/* ========================================
              ANNOUNCEMENTS
          ======================================== */}

          <TabsContent value="announcements">
            <Card>
              <CardHeader>
                <CardTitle>Announcements</CardTitle>

                <CardDescription>
                  Stay updated with the latest announcements from OurTribe.
                </CardDescription>
              </CardHeader>

              <CardContent>
                {error && (
                  <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {loadingAnnouncements ? (
                  <div className="flex min-h-40 items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                      Loading announcements...
                    </p>
                  </div>
                ) : announcements.length === 0 ? (
                  <div className="flex min-h-40 items-center justify-center">
                    <div className="text-center">
                      <Megaphone className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />

                      <p className="text-sm font-medium">
                        No announcements yet
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Check back later for updates.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <div
                        key={announcement.id}
                        className="rounded-lg border p-5"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="font-semibold">
                              {announcement.title}
                            </h3>

                            <p className="mt-1 text-xs text-muted-foreground">
                              Posted{" "}
                              {new Date(
                                announcement.createdAt,
                              ).toLocaleDateString()}
                            </p>
                          </div>

                          <Badge variant="secondary">Announcement</Badge>
                        </div>

                        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                          {announcement.description}
                        </p>

                        {announcement.createdBy && (
                          <div className="mt-4 border-t pt-3 text-xs text-muted-foreground">
                            Posted by{" "}
                            <span className="font-medium text-foreground">
                              {announcement.createdBy.firstName}{" "}
                              {announcement.createdBy.lastName}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ========================================
              SETTINGS
          ======================================== */}

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </main>

      {/* ========================================
          LOGOUT CONFIRMATION
      ======================================== */}

      <AlertDialog open={logoutConfirmOpen} onOpenChange={setLogoutConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out?</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to log out of your account?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="bg-red-600 hover:bg-red-700"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ========================================
   SETTINGS
======================================== */

function SettingsTab() {
  const [activeSetting, setActiveSetting] = useState("profile");

  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
      {/* SETTINGS NAV */}

      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-base">Settings</CardTitle>

          <CardDescription>Manage your account.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-1">
          <Button
            variant={activeSetting === "profile" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveSetting("profile")}
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>

          <Button
            variant={activeSetting === "password" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveSetting("password")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Password
          </Button>
        </CardContent>
      </Card>

      {/* SETTINGS CONTENT */}

      <div>
        {activeSetting === "profile" ? (
          <ProfileSettings />
        ) : (
          <PasswordSettings />
        )}
      </div>
    </div>
  );
}

/* ========================================
   PROFILE
======================================== */

function ProfileSettings() {
  const { data: session } = useSession();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>

        <CardDescription>
          View and update your personal information.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium">First Name</label>

            <input
              className="h-10 rounded-md border bg-muted px-3 text-sm"
              placeholder="First name"
              value={session?.user?.firstName || ""}
              readOnly
              disabled
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Last Name</label>

            <input
              className="h-10 rounded-md border bg-muted px-3 text-sm"
              placeholder="Last name"
              value={session?.user?.lastName || ""}
              readOnly
              disabled
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Phone Number</label>

            <input
              className="h-10 rounded-md border bg-background px-3 text-sm"
              placeholder="Phone number"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Email</label>

            <input
              className="h-10 rounded-md border bg-muted px-3 text-sm"
              placeholder="Email"
              value={session?.user?.email || ""}
              readOnly
              disabled
            />
          </div>
        </div>

        <Button className="mt-6">Save Changes</Button>
      </CardContent>
    </Card>
  );
}

/* ========================================
   PASSWORD
======================================== */

function PasswordSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setSuccess("Password updated successfully.");
    } catch (error) {
      console.error("CHANGE PASSWORD ERROR:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>

        <CardDescription>
          Update your password to keep your account secure.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="max-w-md space-y-5">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Current Password</label>

            <input
              type="password"
              className="h-10 rounded-md border bg-background px-3 text-sm"
              placeholder="Current password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">New Password</label>

            <input
              type="password"
              className="h-10 rounded-md border bg-background px-3 text-sm"
              placeholder="New password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Confirm New Password</label>

            <input
              type="password"
              className="h-10 rounded-md border bg-background px-3 text-sm"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          {success && <p className="text-sm text-green-600">{success}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
