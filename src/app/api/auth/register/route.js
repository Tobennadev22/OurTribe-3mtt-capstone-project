import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();

    const { firstName, lastName, phone, email, password } = body;

    // Validate required fields
    if (!firstName || !lastName || !phone || !email || !password) {
      return Response.json(
        {
          message:
            "First name, last name, phone, email and password are required",
        },
        { status: 400 },
      );
    }

    // Validate password
    if (password.length < 8) {
      return Response.json(
        {
          message: "Password must be at least 8 characters",
        },
        { status: 400 },
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
    });

    if (existingUser) {
      return Response.json(
        {
          message: "A user with this email already exists",
        },
        { status: 409 },
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create member
    const user = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,

        // Do NOT allow registration to choose ADMIN
        role: "USER",
      },
    });

    return Response.json(
      {
        message: "Registration successful",
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("REGISTRATION ERROR:", error);

    return Response.json(
      {
        message: "Something went wrong",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}
