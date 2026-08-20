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
            <form>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="password-spacing">New Password</Label>
                  <Input
                    id="email-spacing"
                    type="password"
                    placeholder="**********"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="items-center">
                    <Label htmlFor="password-spacing">Confirm Password</Label>
                  </div>
                  <Input
                    id="password-spacing"
                    type="password"
                    placeholder="**********"
                    required
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button className="w-full gap-6 bg-lime-700 hover:bg-lime-500">
              Update
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
