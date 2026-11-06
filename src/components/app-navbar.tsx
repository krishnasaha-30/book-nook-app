import { getCurrentUser } from "@/lib/session";
import { Navbar } from "@/components/navbar";

/**
 * Server wrapper: reads the BetterAuth session server-side and hands it to
 * the client navbar. Rendered inside the layout's existing `<Suspense>`
 * boundary because it reads cookies.
 */
export async function AppNavbar() {
  const session = await getCurrentUser();

  return <Navbar session={session} />;
}
