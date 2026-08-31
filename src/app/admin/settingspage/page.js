"use client";

import { useState } from "react";

import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import DashboardHeaders from "@/components/dashboardheaders";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleChangePassword(event) {
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
    <div className="p-6">
      <DashboardHeaders
        title="Setting"
        description="Manage all settings here"
        ModeToggle={ModeToggle}
      />
      <Separator />

      <div className="mx-auto grid w-full max-w-sm gap-4 mt-24">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Change Password</CardTitle>
            <CardDescription>
              Change your password to make it safer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              id="change-password-form"
              onSubmit={handleChangePassword}
            >
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="**********"
                    value={currentPassword}
                    onChange={(event) =>
                      setCurrentPassword(event.target.value)
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="**********"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="items-center">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                  </div>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="**********"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    required
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                {success && (
                  <p className="text-sm text-green-600">{success}</p>
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              form="change-password-form"
              disabled={loading}
              className="w-full gap-6 bg-lime-700 hover:bg-lime-500"
            >
              {loading ? "Updating..." : "Update"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
