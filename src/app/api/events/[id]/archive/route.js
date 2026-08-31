import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: eventId } = await params;

    // Make sure the event actually exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return Response.json({ message: "Event not found" }, { status: 404 });
    }

    // Create the archive record for this user
    // (upsert avoids a duplicate-key crash if they click Archive twice)
    await prisma.eventArchive.upsert({
      where: {
        eventId_userId: {
          eventId,
          userId: session.user.id,
        },
      },
      update: {},
      create: {
        eventId,
        userId: session.user.id,
      },
    });

    return Response.json(
      { message: "Event archived successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("ARCHIVE EVENT ERROR:", error);

    return Response.json(
      { message: "Failed to archive event", error: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: eventId } = await params;

    await prisma.eventArchive.deleteMany({
      where: {
        eventId,
        userId: session.user.id,
      },
    });

    return Response.json(
      { message: "Event removed from archive" },
      { status: 200 },
    );
  } catch (error) {
    console.error("UNARCHIVE EVENT ERROR:", error);

    return Response.json(
      { message: "Failed to remove event from archive", error: error.message },
      { status: 500 },
    );
  }
}
