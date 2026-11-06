"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpenCheck } from "lucide-react";
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
import { validateRegister, type FieldErrors } from "@/lib/auth-validation";
import { signIn, signUp } from "@/lib/auth-client";

export function RegisterForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<"credentials" | "google" | null>(
    null,
  );

  const redirectTarget = searchParams.get("redirect") || "/";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const { data, errors } = validateRegister({
      name,
      email,
      photoUrl,
      password,
    });
    const nextErrors: FieldErrors = { ...errors };

    if (data && password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    setFieldErrors(nextErrors);
    if (!data || Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting("credentials");

    try {
      const result = await signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        image: data.photoUrl || undefined,
      });

      if (result.error) {
        setFormError(result.error.message || "Could not create your account.");
        setSubmitting(null);
        return;
      }

      toast.add({
        title: "Welcome to BookNook",
        description: "Your shelf account is ready.",
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
        Create your shelf
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        One minute to join the community library.
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
          <Field data-invalid={fieldErrors.name ? "true" : undefined}>
            <FieldLabel htmlFor="register-name">Name</FieldLabel>
            <Input
              id="register-name"
              name="name"
              autoComplete="name"
              placeholder="Your full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-invalid={Boolean(fieldErrors.name)}
            />
            {fieldErrors.name ? (
              <FieldError>{fieldErrors.name}</FieldError>
            ) : null}
          </Field>

          <Field data-invalid={fieldErrors.email ? "true" : undefined}>
            <FieldLabel htmlFor="register-email">Email</FieldLabel>
            <Input
              id="register-email"
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

          <Field data-invalid={fieldErrors.photoUrl ? "true" : undefined}>
            <FieldLabel htmlFor="register-photo-url">Photo URL</FieldLabel>
            <Input
              id="register-photo-url"
              name="photoUrl"
              type="url"
              autoComplete="url"
              placeholder="https://example.com/your-photo.jpg"
              value={photoUrl}
              onChange={(event) => setPhotoUrl(event.target.value)}
              aria-invalid={Boolean(fieldErrors.photoUrl)}
            />
            {fieldErrors.photoUrl ? (
              <FieldError>{fieldErrors.photoUrl}</FieldError>
            ) : null}
          </Field>

          <Field data-invalid={fieldErrors.password ? "true" : undefined}>
            <FieldLabel htmlFor="register-password">Password</FieldLabel>
            <Input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 6 characters, with uppercase and lowercase letters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(fieldErrors.password)}
            />
            {fieldErrors.password ? (
              <FieldError>{fieldErrors.password}</FieldError>
            ) : null}
          </Field>

          <Field
            data-invalid={fieldErrors.confirmPassword ? "true" : undefined}
          >
            <FieldLabel htmlFor="register-confirm-password">
              Confirm password
            </FieldLabel>
            <Input
              id="register-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              aria-invalid={Boolean(fieldErrors.confirmPassword)}
            />
            {fieldErrors.confirmPassword ? (
              <FieldError>{fieldErrors.confirmPassword}</FieldError>
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
              <BookOpenCheck className="size-4" />
            )}
            {submitting === "credentials"
              ? "Creating your account…"
              : "Create account"}
          </Button>
        </FieldGroup>
      </form>

      <p className="mt-4 text-xs text-muted-foreground">
        By creating an account you agree to keep borrowed books safe and return
        them on time. No other fine print.
      </p>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already a member?{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
