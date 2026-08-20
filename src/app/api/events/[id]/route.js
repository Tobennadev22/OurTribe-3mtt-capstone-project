// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// export async function GET(request, { params }) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session) {
//       return Response.json(
//         {
//           message: "Unauthorized",
//         },
//         {
//           status: 401,
//         },
//       );
//     }

//     const { id } = await params;

//     if (!id) {
//       return Response.json(
//         {
//           message: "Event ID is required",
//         },
//         {
//           status: 400,
//         },
//       );
//     }

//     const event = await prisma.event.findUnique({
//       where: {
//         id,
//       },
//       include: {
//         createdBy: {
//           select: {
//             id: true,
//             firstName: true,
//             lastName: true,
//             email: true,
//           },
//         },
//       },
//     });

//     if (!event) {
//       return Response.json(
//         {
//           message: "Event not found",
//         },
//         {
//           status: 404,
//         },
//       );
//     }

//     return Response.json(event, {
//       status: 200,
//     });
//   } catch (error) {
//     console.error("GET EVENT ERROR:", error);

//     return Response.json(
//       {
//         message: "Failed to fetch event",
//         error: error.message,
//       },
//       {
//         status: 500,
//       },
//     );
//   }
// }

// export async function PATCH(request, { params }) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session) {
//       return Response.json(
//         {
//           message: "Unauthorized",
//         },
//         {
//           status: 401,
//         },
//       );
//     }

//     if (session.user.role !== "ADMIN") {
//       return Response.json(
//         {
//           message: "Forbidden",
//         },
//         {
//           status: 403,
//         },
//       );
//     }

//     const { id } = await params;

//     if (!id) {
//       return Response.json(
//         {
//           message: "Event ID is required",
//         },
//         {
//           status: 400,
//         },
//       );
//     }

//     const body = await request.json();

//     const { title, description } = body;

//     if (!title || !description) {
//       return Response.json(
//         {
//           message: "Title and description are required",
//         },
//         {
//           status: 400,
//         },
//       );
//     }

//     const existingEvent = await prisma.event.findUnique({
//       where: {
//         id,
//       },
//     });

//     if (!existingEvent) {
//       return Response.json(
//         {
//           message: "Event not found",
//         },
//         {
//           status: 404,
//         },
//       );
//     }

//     const updatedEvent = await prisma.event.update({
//       where: {
//         id,
//       },
//       data: {
//         title: title.trim(),
//         description: description.trim(),
//       },
//       include: {
//         createdBy: {
//           select: {
//             id: true,
//             firstName: true,
//             lastName: true,
//             email: true,
//           },
//         },
//       },
//     });

//     return Response.json(
//       {
//         message: "Event updated successfully",
//         event: updatedEvent,
//       },
//       {
//         status: 200,
//       },
//     );
//   } catch (error) {
//     console.error("UPDATE EVENT ERROR:", error);

//     return Response.json(
//       {
//         message: "Failed to update event",
//         error: error.message,
//       },
//       {
//         status: 500,
//       },
//     );
//   }
// }

// export async function DELETE(request, { params }) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session) {
//       return Response.json(
//         {
//           message: "Unauthorized",
//         },
//         {
//           status: 401,
//         },
//       );
//     }

//     if (session.user.role !== "ADMIN") {
//       return Response.json(
//         {
//           message: "Forbidden",
//         },
//         {
//           status: 403,
//         },
//       );
//     }

//     const { id } = await params;

//     if (!id) {
//       return Response.json(
//         {
//           message: "Event ID is required",
//         },
//         {
//           status: 400,
//         },
//       );
//     }

//     const existingEvent = await prisma.event.findUnique({
//       where: {
//         id,
//       },
//     });

//     if (!existingEvent) {
//       return Response.json(
//         {
//           message: "Event not found",
//         },
//         {
//           status: 404,
//         },
//       );
//     }

//     await prisma.event.delete({
//       where: {
//         id,
//       },
//     });

//     return Response.json(
//       {
//         message: "Event deleted successfully",
//       },
//       {
//         status: 200,
//       },
//     );
//   } catch (error) {
//     console.error("DELETE EVENT ERROR:", error);

//     return Response.json(
//       {
//         message: "Failed to delete event",
//         error: error.message,
//       },
//       {
//         status: 500,
//       },
//     );
//   }
// }

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return Response.json(
        {
          message: "Event ID is required",
        },
        { status: 400 },
      );
    }

    const event = await prisma.event.findUnique({
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

    if (!event) {
      return Response.json(
        {
          message: "Event not found",
        },
        { status: 404 },
      );
    }

    return Response.json(event, {
      status: 200,
    });
  } catch (error) {
    console.error("GET EVENT ERROR:", error);

    return Response.json(
      {
        message: "Failed to fetch event",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request, { params }) {
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
          message: "Event ID is required",
        },
        { status: 400 },
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

    if (!title || !description || !eventDate || !startTime || !endTime) {
      return Response.json(
        {
          message:
            "Title, description, event date, start time and end time are required",
        },
        { status: 400 },
      );
    }

    const existingEvent = await prisma.event.findUnique({
      where: {
        id,
      },
    });

    if (!existingEvent) {
      return Response.json(
        {
          message: "Event not found",
        },
        { status: 404 },
      );
    }

    const parsedEventDate = new Date(eventDate);

    if (Number.isNaN(parsedEventDate.getTime())) {
      return Response.json(
        {
          message: "Invalid event date",
        },
        { status: 400 },
      );
    }

    const updatedEvent = await prisma.event.update({
      where: {
        id,
      },

      data: {
        title: title.trim(),
        description: description.trim(),

        eventDate: parsedEventDate,

        startTime: startTime.trim(),
        endTime: endTime.trim(),

        location: location?.trim() || null,
        image: image?.trim() || null,
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
        message: "Event updated successfully",
        event: updatedEvent,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("UPDATE EVENT ERROR:", error);

    return Response.json(
      {
        message: "Failed to update event",
        error: error.message,
      },
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

    if (session.user.role !== "ADMIN") {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    if (!id) {
      return Response.json(
        {
          message: "Event ID is required",
        },
        { status: 400 },
      );
    }

    const event = await prisma.event.findUnique({
      where: {
        id,
      },
    });

    if (!event) {
      return Response.json(
        {
          message: "Event not found",
        },
        { status: 404 },
      );
    }

    await prisma.event.delete({
      where: {
        id,
      },
    });

    return Response.json(
      {
        message: "Event deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE EVENT ERROR:", error);

    return Response.json(
      {
        message: "Failed to delete event",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
