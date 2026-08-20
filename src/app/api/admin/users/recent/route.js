import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    if (session.user.role !== "ADMIN") {
      return Response.json(
        {
          message: "Forbidden",
        },
        {
          status: 403,
        },
      );
    }

    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },

      take: 5,

      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
        createdAt: true,
      },
    });

    return Response.json(users, {
      status: 200,
    });
  } catch (error) {
    console.error("GET RECENT USERS ERROR:", error);

    return Response.json(
      {
        message: "Failed to fetch recent registrations",
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
