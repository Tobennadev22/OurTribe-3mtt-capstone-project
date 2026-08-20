import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json(
        {
          message: "Announcement ID is required",
        },
        {
          status: 400,
        },
      );
    }

    const announcement = await prisma.announcement.findUnique({
      where: {
        id,
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

    if (!announcement) {
      return Response.json(
        {
          message: "Announcement not found",
        },
        {
          status: 404,
        },
      );
    }

    return Response.json(announcement, {
      status: 200,
    });
  } catch (error) {
    console.error("GET ANNOUNCEMENT ERROR:", error);

    return Response.json(
      {
        message: "Failed to fetch announcement",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json(
        {
          message: "Announcement ID is required",
        },
        {
          status: 400,
        },
      );
    }

    // --------------------------------
    // READ REQUEST BODY
    // --------------------------------

    const body = await request.json();

    const { title, description } = body;

    // --------------------------------
    // VALIDATION
    // --------------------------------

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

    // --------------------------------
    // CHECK ANNOUNCEMENT EXISTS
    // --------------------------------

    const existingAnnouncement = await prisma.announcement.findUnique({
      where: {
        id,
      },
    });

    if (!existingAnnouncement) {
      return Response.json(
        {
          message: "Announcement not found",
        },
        {
          status: 404,
        },
      );
    }

    // --------------------------------
    // UPDATE
    // --------------------------------

    const updatedAnnouncement = await prisma.announcement.update({
      where: {
        id,
      },

      data: {
        title: title.trim(),
        description: description.trim(),
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

    // --------------------------------
    // RETURN JSON
    // --------------------------------

    return Response.json(
      {
        message: "Announcement updated successfully",
        announcement: updatedAnnouncement,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("UPDATE ANNOUNCEMENT ERROR:", error);

    return Response.json(
      {
        message: "Failed to update announcement",
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json(
        {
          message: "Announcement ID is required",
        },
        {
          status: 400,
        },
      );
    }

    // Check that the announcement exists
    const announcement = await prisma.announcement.findUnique({
      where: {
        id,
      },
    });

    if (!announcement) {
      return Response.json(
        {
          message: "Announcement not found",
        },
        {
          status: 404,
        },
      );
    }

    // Delete announcement
    await prisma.announcement.delete({
      where: {
        id,
      },
    });

    // IMPORTANT:
    // Always return JSON
    return Response.json(
      {
        message: "Announcement deleted successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("DELETE ANNOUNCEMENT ERROR:", error);

    return Response.json(
      {
        message: "Failed to delete announcement",
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
