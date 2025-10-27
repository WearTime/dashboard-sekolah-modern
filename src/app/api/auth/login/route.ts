import { NextRequest, NextResponse } from "next/server";
import { prisma } from "WT/lib/prisma";
import { verifyPassword } from "WT/lib/utils";
import { createSession } from "WT/lib/auth";
import { loginSchema } from "WT/validators/auth.validator";
import { ApiResponse } from "WT/types";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Email atau password salah",
        },
        { status: 401 }
      );
    }

    const isPasswordValid = await verifyPassword(
      validatedData.password,
      user.password
    );

    if (!isPasswordValid) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Email atau password salah",
        },
        { status: 401 }
      );
    }

    await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: [],
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Login berhasil",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Validasi gagal",
          error: error.issues[0]?.message,
        },
        { status: 400 }
      );
    }

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan yang tidak diketahui";

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Terjadi kesalahan pada server",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
