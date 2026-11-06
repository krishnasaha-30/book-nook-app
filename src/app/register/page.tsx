import type { Metadata } from "next";
import { Suspense } from "react";
import {
  AuthFormSkeleton,
  AuthShell,
} from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { AuthedRedirect } from "@/components/auth/authed-redirect";
import { isGoogleLoginEnabled } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Create a BookNook account with email or Google and join the community library.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Join the community shelf"
      panelTitle="Claim your library card."
      highlights={[
        "Borrow any available book for seven quiet days.",
        "Add books from your own collection and share them out.",
        "Your name stays proudly on every book you contribute.",
      ]}
    >
      <Suspense fallback={<AuthFormSkeleton />}>
        <AuthedRedirect />
        <RegisterForm googleEnabled={isGoogleLoginEnabled} />
      </Suspense>
    </AuthShell>
  );
}
