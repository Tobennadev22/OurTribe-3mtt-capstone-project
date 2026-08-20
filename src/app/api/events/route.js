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

    const events = await prisma.event.findMany({
      orderBy: {
        eventDate: "asc",
      },

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
    });

    return Response.json(events, {
      status: 200,
    });
  } catch (error) {
    console.error("GET EVENTS ERROR:", error);

    return Response.json(
      {
        message: "Failed to fetch events",
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request) {
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

    // Only admins can create events
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

    const body = await request.json();

    const {
      title,
      description,
      eventDate,
      startTime,
      endTime,
      location,
      image,
    } = body;

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!title || !description || !eventDate || !startTime || !endTime) {
      return Response.json(
        {
          message:
            "Title, description, event date, start time and end time are required",
        },
        {
          status: 400,
        },
      );
    }

    // -----------------------------
    // CREATE EVENT
    // -----------------------------

    const event = await prisma.event.create({
      data: {
        title: title.trim(),
        description: description.trim(),

        eventDate: new Date(eventDate),

        startTime,
        endTime,

        location: location?.trim() || null,
        image: image?.trim() || null,

        createdById: session.user.id,
      },

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
    });

    return Response.json(
      {
        message: "Event created successfully",
        event,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);

    return Response.json(
      {
        message: "Failed to create event",
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
