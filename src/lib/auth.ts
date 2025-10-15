import { getIronSession, IronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData } from "WT/types";
import { getUserPermissions } from "./permissions";

const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "smk_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function createSession(user: SessionData["user"]) {
  const session = await getSession();

  if (user) {
    const permissions = await getUserPermissions(user.id);
    session.user = {
      ...user,
      permissions,
    };
  } else {
    session.user = user;
  }

  session.isLoggedIn = true;
  await session.save();
}

export async function destroySession() {
  const session = await getSession();
  session.destroy();
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session.isLoggedIn === true && !!session.user;
}

export async function getCurrentUser() {
  const session = await getSession();

  if (session.user && !session.user.permissions) {
    const permissions = await getUserPermissions(session.user.id);
    session.user.permissions = permissions;
    await session.save();
  }

  return session.user;
}

export async function requireAuth() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    throw new Error("Unauthorized");
  }
  return getCurrentUser();
}
