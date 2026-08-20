import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: {
        email,
      },
      data: {
        role: "ADMIN",
      },
    });

    return Response.json({
      message: "User successfully promoted to ADMIN",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Could not make user admin",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
