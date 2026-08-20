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

    const announcements = await prisma.announcement.findMany({
      orderBy: {
        createdAt: "desc",
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

    return Response.json(announcements);
  } catch (error) {
    console.error("GET ANNOUNCEMENTS ERROR:", error);

    return Response.json(
      {
        message: "Failed to fetch announcements",
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

    // Only admins can create announcements
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

    const { title, description } = body;

    if (!title || !description) {
      return Response.json(
        {
          message: "Title and description are required",
        },
        {
          status: 400,
        },
      );
    }

    const announcement = await prisma.announcement.create({
      data: {
        title: title.trim(),
        description: description.trim(),

        // This is the important part
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
        message: "Announcement created successfully",
        announcement,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("CREATE ANNOUNCEMENT ERROR:", error);

    return Response.json(
      {
        message: "Failed to create announcement",
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
