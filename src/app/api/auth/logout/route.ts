import { NextResponse } from "next/server";
import { destroySession } from "WT/lib/auth";
import { ApiResponse } from "WT/types";

export async function POST() {
  try {
    await destroySession();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Logout berhasil",
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
