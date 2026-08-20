import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: "USER",
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

      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(users);
  } catch (error) {
    console.error("FETCH USERS ERROR:", error);

    return Response.json(
      {
        message: "Failed to fetch users",
      },
      {
        status: 500,
      },
    );
  }
}
