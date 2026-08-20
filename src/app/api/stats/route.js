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

    const [totalMembers, upcomingEvents, totalAnnouncements] =
      await Promise.all([
        prisma.user.count(),

        prisma.event.count({
          where: {
            eventDate: {
              gte: new Date(),
            },
          },
        }),

        prisma.announcement.count(),
      ]);

    return Response.json(
      {
        totalMembers,
        upcomingEvents,
        totalAnnouncements,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("GET STATS ERROR:", error);

    return Response.json(
      {
        message: "Failed to fetch stats",
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
