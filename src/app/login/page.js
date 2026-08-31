"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const VERIFY_ERROR_MESSAGES = {
  "missing-token": "That verification link is missing its token.",
  "invalid-token": "That verification link is invalid or has already been used.",
  "expired-token":
    "That verification link has expired. Please register again or request a new link.",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const verified = searchParams.get("verified");

  const [error, setError] = useState(() => {
    if (verified !== "error") {
      return "";
    }

    const reason = searchParams.get("reason");

    return (
      VERIFY_ERROR_MESSAGES[reason] ||
      "We couldn't verify your email. Please try again."
    );
  });

  const [notice, setNotice] = useState(() =>
    verified === "success"
      ? "Your email has been verified. You can now log in."
      : "",
  );

  async function handleLogin(event) {
    event.preventDefault();

    setError("");
    setNotice("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(
        result.error === "CredentialsSignin"
          ? "Invalid email or password"
          : result.error,
      );
      setLoading(false);
      return;
    }

    const response = await fetch("/api/auth/session");
    const session = await response.json();

    if (session?.user?.role === "ADMIN") {
      router.push("/admin");
    } else if (session?.user?.role === "USER") {
      router.push("/user");
    } else {
      setError("User role could not be determined");
    }

    router.refresh();
  }

  return (
    <div>
      <div className="mx-auto mt-24 grid w-full max-w-sm gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>

            <CardDescription>Sign in to access your dashboard</CardDescription>

            <CardAction>
              <Button variant="link" onClick={() => router.push("/register")}>
                Sign Up
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-4">
                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>

                  <Input
                    id="email"
                    type="email"
                    placeholder="tobe@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>

                {/* Password */}
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>

                    <a
                      href="/forgetpassword"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="**********"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Notice */}
                {notice && <p className="text-sm text-green-600">{notice}</p>}

                {/* Error */}
                {error && <p className="text-sm text-red-500">{error}</p>}

                {/* Login button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-lime-700 hover:bg-lime-500"
                >
                  {loading ? "Signing in..." : "Login"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Login() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

export default Login;
