import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json(
        {
          message: "User ID is required",
        },
        {
          status: 400,
        },
      );
    }

    const body = await request.json();

    const { status } = body;

    if (!["ACTIVE", "SUSPENDED"].includes(status)) {
      return Response.json(
        {
          message: "Invalid user status",
        },
        {
          status: 400,
        },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return Response.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        },
      );
    }

    // Never allow this endpoint to modify an admin
    if (user.role !== "USER") {
      return Response.json(
        {
          message: "Admin users cannot be suspended here",
        },
        {
          status: 403,
        },
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },

      data: {
        status,
      },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return Response.json({
      message:
        status === "SUSPENDED"
          ? "User suspended successfully"
          : "User unsuspended successfully",

      user: updatedUser,
    });
  } catch (error) {
    console.error("UPDATE USER STATUS ERROR:", error);

    return Response.json(
      {
        message: "Failed to update user status",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    if (!id) {
      return Response.json(
        {
          message: "User ID is required",
        },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
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

    // Never allow this endpoint to delete an admin
    if (user.role !== "USER") {
      return Response.json(
        {
          message: "Admin users cannot be deleted here",
        },
        { status: 403 },
      );
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });

    return Response.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    return Response.json(
      {
        message: "Failed to delete user",
      },
      { status: 500 },
    );
  }
}
