import type { Metadata } from "next";
import { Suspense } from "react";
import {
  AuthFormSkeleton,
  AuthShell,
} from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { AuthedRedirect } from "@/components/auth/authed-redirect";
import { isGoogleLoginEnabled } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Sign in to your BookNook account to add books, borrow and track returns.",
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Your reading life, in one place"
      panelTitle="Pick up right where you left off."
      highlights={[
        "Track every borrowed book in My Borrows with a clear return date.",
        "Share your own shelf on the Add Book page in under a minute.",
        "Return early whenever you like — there are no late fees, ever.",
      ]}
    >
      <Suspense fallback={<AuthFormSkeleton />}>
        <AuthedRedirect />
        <LoginForm googleEnabled={isGoogleLoginEnabled} />
      </Suspense>
    </AuthShell>
  );
}
