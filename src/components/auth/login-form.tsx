"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn } from "lucide-react";
import { Logo } from "@/components/logo";
import { GoogleIcon } from "@/components/auth/google-icon";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { validateLogin, type FieldErrors } from "@/lib/auth-validation";
import { signIn } from "@/lib/auth-client";

export function LoginForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<
    "credentials" | "google" | null
  >(null);

  const redirectTarget = searchParams.get("redirect") || "/";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const { data, errors } = validateLogin({ email, password });
    setFieldErrors(errors);

    if (!data) {
      return;
    }

    setSubmitting("credentials");

    try {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        setFormError(
          result.error.message || "Could not sign you in. Try again.",
        );
        setSubmitting(null);
        return;
      }

      toast.add({
        title: "Welcome back",
        description: "You are signed in to your BookNook shelf.",
        type: "success",
      });

      router.push(redirectTarget);
      router.refresh();
    } catch {
      setFormError("Unexpected error. Is the auth server running?");
      setSubmitting(null);
    }
  };

  const handleGoogleSignIn = async () => {
    setFormError(null);
    setSubmitting("google");

    try {
      const result = await signIn.social({
        provider: "google",
        callbackURL: redirectTarget,
      });

      if (result.error) {
        setFormError(
          result.error.message || "Could not start Google sign-in. Try again.",
        );
        setSubmitting(null);
      }
    } catch {
      setFormError("Could not start Google sign-in. Try again.");
      setSubmitting(null);
    }
  };

  return (
    <div>
      <div className="lg:hidden">
        <Logo />
      </div>

      <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight lg:mt-0">
        Welcome back
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sign in to add books, borrow and track your returns.
      </p>

      {googleEnabled ? (
        <>
          <Button
            type="button"
            variant="outline"
            className="mt-6 h-11 w-full gap-2.5"
            disabled={submitting !== null}
            onClick={() => void handleGoogleSignIn()}
          >
            <GoogleIcon />
            Continue with Google
          </Button>

          <FieldSeparator className="my-5">or</FieldSeparator>
        </>
      ) : null}

      <form onSubmit={handleSubmit} noValidate>
        <FieldGroup className="gap-4">
          <Field data-invalid={fieldErrors.email ? "true" : undefined}>
            <FieldLabel htmlFor="login-email">Email</FieldLabel>
            <Input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(fieldErrors.email)}
            />
            {fieldErrors.email ? (
              <FieldError>{fieldErrors.email}</FieldError>
            ) : null}
          </Field>

          <Field data-invalid={fieldErrors.password ? "true" : undefined}>
            <FieldLabel htmlFor="login-password">Password</FieldLabel>
            <Input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(fieldErrors.password)}
            />
            {fieldErrors.password ? (
              <FieldError>{fieldErrors.password}</FieldError>
            ) : null}
          </Field>

          {formError ? (
            <p
              role="alert"
              className="rounded-lg border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive"
            >
              {formError}
            </p>
          ) : null}

          <Button
            type="submit"
            size="lg"
            className="mt-1 h-11 w-full"
            disabled={submitting !== null}
          >
            {submitting === "credentials" ? (
              <Spinner className="size-4" />
            ) : (
              <LogIn className="size-4" />
            )}
            {submitting === "credentials" ? "Signing in…" : "Sign in"}
          </Button>
        </FieldGroup>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to BookNook?{" "}
        <Link
          href="/register"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
