"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import type { SessionUser } from "@/lib/session";

function initialsFor(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("") || "BN"
  );
}

function isValidPhotoUrl(value: string) {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function ProfileForm({ user }: { user: SessionUser }) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [photoUrl, setPhotoUrl] = useState(user.image ?? "");
  const [nameError, setNameError] = useState<string | null>(null);
  const [photoUrlError, setPhotoUrlError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNameError(null);
    setPhotoUrlError(null);
    setFormError(null);

    const nextName = name.trim();
    const nextPhotoUrl = photoUrl.trim();

    if (nextName.length < 2 || nextName.length > 64) {
      setNameError("Name must be between 2 and 64 characters.");
    }

    if (!isValidPhotoUrl(nextPhotoUrl)) {
      setPhotoUrlError("Enter a valid HTTP or HTTPS photo URL.");
    }

    if (
      nextName.length < 2 ||
      nextName.length > 64 ||
      !isValidPhotoUrl(nextPhotoUrl)
    ) {
      return;
    }

    setSaving(true);

    try {
      const result = await authClient.updateUser({
        name: nextName,
        image: nextPhotoUrl || null,
      });

      if (result.error) {
        setFormError(result.error.message || "Could not update your profile.");
        return;
      }

      setName(nextName);
      setPhotoUrl(nextPhotoUrl);
      toast.add({
        title: "Profile updated",
        description: "Your BookNook profile changes have been saved.",
        type: "success",
      });
      router.refresh();
    } catch {
      setFormError("Could not update your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-3xl border border-border/70 bg-card/60 p-6 shadow-sm sm:p-8">
      <div className="flex flex-col items-center gap-4 border-b border-border/70 pb-7 text-center sm:flex-row sm:text-left">
        <Avatar size="lg" className="size-20">
          <AvatarImage src={photoUrl || undefined} alt={`${name} profile`} />
          <AvatarFallback className="font-display text-xl font-semibold text-primary">
            {initialsFor(name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-semibold">{name}</h2>
          <p className="mt-1 break-all text-sm text-muted-foreground">
            {user.email}
          </p>
        </div>
      </div>

      <form className="pt-7" onSubmit={handleSubmit} noValidate>
        <FieldGroup className="gap-5">
          <Field data-invalid={nameError ? "true" : undefined}>
            <FieldLabel htmlFor="profile-name">Name</FieldLabel>
            <Input
              id="profile-name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-invalid={Boolean(nameError)}
            />
            {nameError ? <FieldError>{nameError}</FieldError> : null}
          </Field>

          <Field>
            <FieldLabel htmlFor="profile-email">Email</FieldLabel>
            <Input
              id="profile-email"
              name="email"
              type="email"
              value={user.email}
              readOnly
              aria-describedby="profile-email-help"
            />
            <p
              id="profile-email-help"
              className="text-xs text-muted-foreground"
            >
              Email address is managed by your sign-in provider.
            </p>
          </Field>

          <Field data-invalid={photoUrlError ? "true" : undefined}>
            <FieldLabel htmlFor="profile-photo-url">Photo URL</FieldLabel>
            <Input
              id="profile-photo-url"
              name="photoUrl"
              type="url"
              autoComplete="url"
              placeholder="https://example.com/your-photo.jpg"
              value={photoUrl}
              onChange={(event) => setPhotoUrl(event.target.value)}
              aria-invalid={Boolean(photoUrlError)}
            />
            {photoUrlError ? <FieldError>{photoUrlError}</FieldError> : null}
          </Field>

          {formError ? (
            <p
              role="alert"
              className="rounded-lg border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive"
            >
              {formError}
            </p>
          ) : null}

          <div className="flex justify-end">
            <Button type="submit" className="gap-2" disabled={saving}>
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              {saving ? "Saving profile…" : "Save changes"}
            </Button>
          </div>
        </FieldGroup>
      </form>

      <div className="mt-6 flex items-start gap-2 rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
        <UserRound className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>
          Your profile name is shown to other readers when you share a book.
        </p>
      </div>
    </div>
  );
}
