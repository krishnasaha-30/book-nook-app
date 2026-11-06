import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

/**
 * Inside a Suspense boundary so the cookie check stays out of the static
 * shell. Signed-in visitors are sent back to the shelf.
 */
export async function AuthedRedirect() {
  const session = await getCurrentUser();

  if (session) {
    redirect("/");
  }

  return null;
}
