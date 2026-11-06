import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getSession();

  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  };
}

/**
 * Mints the short-lived JWT that the Express API expects in the
 * `Authorization: Bearer` header. Returns null when nobody is signed in.
 */
export async function getAccessToken(): Promise<string | null> {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session) {
    return null;
  }

  const result = await auth.api.getToken({ headers: requestHeaders });

  return result?.token ?? null;
}
