import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  const loginUrl = new URL("/login", process.env.NEXTAUTH_URL);

  if (!token) {
    loginUrl.searchParams.set("verified", "error");
    loginUrl.searchParams.set("reason", "missing-token");

    return NextResponse.redirect(loginUrl);
  }

  const user = await prisma.user.findUnique({
    where: {
      verificationToken: token,
    },
  });

  if (!user) {
    loginUrl.searchParams.set("verified", "error");
    loginUrl.searchParams.set("reason", "invalid-token");

    return NextResponse.redirect(loginUrl);
  }

  if (
    user.verificationTokenExpiry &&
    user.verificationTokenExpiry < new Date()
  ) {
    loginUrl.searchParams.set("verified", "error");
    loginUrl.searchParams.set("reason", "expired-token");

    return NextResponse.redirect(loginUrl);
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
    },
  });

  loginUrl.searchParams.set("verified", "success");

  return NextResponse.redirect(loginUrl);
}
