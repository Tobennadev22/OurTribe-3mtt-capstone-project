"use client";

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
import { useRouter } from "next/navigation";

function forgetpassword() {
  const router = useRouter();
  return (
    <div>
      <div className="mx-auto grid w-full max-w-sm gap-4 mt-24">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Forgot Password</CardTitle>
            <CardDescription>
              update your password to access your account
            </CardDescription>
            <CardAction>
              <Button variant="link" onClick={() => router.push("/login")}>
                Back
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email-spacing">Email</Label>
                  <Input
                    id="email-spacing"
                    type="email"
                    placeholder="Tobe@example.com"
                    required
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button className="w-full gap-6">Submit</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default forgetpassword;
