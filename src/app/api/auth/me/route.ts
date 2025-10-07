import { NextResponse } from "next/server";
import { getCurrentUser, isAuthenticated } from "WT/lib/auth";
import { ApiResponse } from "WT/types";

export async function GET() {
  try {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const user = await getCurrentUser();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "User data retrieved",
        data: user,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
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
