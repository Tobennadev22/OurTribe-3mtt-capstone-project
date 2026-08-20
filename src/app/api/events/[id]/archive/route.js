// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// export async function GET() {
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

//     const archivedEvents = await prisma.eventArchive.findMany({
//       where: {
//         userId: session.user.id,
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//       include: {
//         event: {
//           include: {
//             createdBy: {
//               select: {
//                 id: true,
//                 firstName: true,
//                 lastName: true,
//                 email: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     const events = archivedEvents.map((archive) => ({
//       id: archive.event.id,
//       title: archive.event.title,
//       description: archive.event.description,
//       eventDate: archive.event.eventDate,
//       startTime: archive.event.startTime,
//       endTime: archive.event.endTime,
//       location: archive.event.location,
//       image: archive.event.image,
//       createdAt: archive.event.createdAt,
//       archivedAt: archive.createdAt,
//       createdBy: archive.event.createdBy,
//     }));

//     return Response.json(events, {
//       status: 200,
//     });
//   } catch (error) {
//     console.error("GET ARCHIVED EVENTS ERROR:", error);

//     return Response.json(
//       {
//         message: "Failed to fetch archived events",
//         error: error.message,
//       },
//       {
//         status: 500,
//       },
//     );
//   }
// }

// app/api/events/[id]/archive/route.js
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
