import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json(
        {
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const body = await request.json();

    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return Response.json(
        {
          message:
            "Current password, new password and confirm password are required",
        },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return Response.json(
        {
          message: "New password must be at least 8 characters",
        },
        { status: 400 },
      );
    }

    if (newPassword !== confirmPassword) {
      return Response.json(
        {
          message: "New password and confirm password do not match",
        },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      return Response.json(
        {
          message: "User not found",
        },
        { status: 404 },
      );
    }

    const currentPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.passwordHash,
    );

    if (!currentPasswordMatch) {
      return Response.json(
        {
          message: "Current password is incorrect",
        },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordHash,
      },
    });

    return Response.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);

    return Response.json(
      {
        message: "Something went wrong",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}
