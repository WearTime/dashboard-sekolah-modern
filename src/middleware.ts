import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData } from "WT/types";

const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "smk_session",
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const session = await getIronSession<SessionData>(
    request as Request,
    response,
    sessionOptions
  );

  const { pathname } = request.nextUrl;

  // Note: Ubah Jika ingin pakai wajib login

  // const publicRoutes = ["/login"];

  // const isPublicRoute = publicRoutes.some((route) =>
  //   pathname.startsWith(route)
  // );

  // if (!session.isLoggedIn && !isPublicRoute && pathname !== "/") {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  if (session.isLoggedIn && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)"],
};
