import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const archivedEvents = await prisma.eventArchive.findMany({
      where: {
        userId: session.user.id,
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        event: {
          include: {
            createdBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    const events = archivedEvents.map((archive) => ({
      id: archive.event.id,
      title: archive.event.title,
      description: archive.event.description,
      eventDate: archive.event.eventDate,
      startTime: archive.event.startTime,
      endTime: archive.event.endTime,
      location: archive.event.location,
      image: archive.event.image,
      createdAt: archive.event.createdAt,
      archivedAt: archive.createdAt,
      createdBy: archive.event.createdBy,
    }));

    return Response.json(events, { status: 200 });
  } catch (error) {
    console.error("GET ARCHIVED EVENTS ERROR:", error);

    return Response.json(
      {
        message: "Failed to fetch archived events",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
