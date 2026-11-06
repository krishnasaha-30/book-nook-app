"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ImagePlus, Loader2, UserRound } from "lucide-react";
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
import type { SessionUser } from "@/lib/session";

const MAX_PHOTO_SIZE = 4 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

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

export function ProfileForm({ user }: { user: SessionUser }) {
  const router = useRouter();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(user.name);
  const [photoUrl, setPhotoUrl] = useState(user.image ?? "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(
    () => () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    },
    [photoPreview],
  );

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setPhotoError(null);

    if (
      file &&
      (!ALLOWED_PHOTO_TYPES.has(file.type) || file.size > MAX_PHOTO_SIZE)
    ) {
      setPhotoError("Choose a JPG, PNG, or WebP image smaller than 4 MB.");
      event.target.value = "";
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNameError(null);
    setPhotoError(null);
    setFormError(null);

    const nextName = name.trim();

    if (nextName.length < 2 || nextName.length > 64) {
      setNameError("Name must be between 2 and 64 characters.");
    }

    if (
      photoFile &&
      (!ALLOWED_PHOTO_TYPES.has(photoFile.type) ||
        photoFile.size > MAX_PHOTO_SIZE)
    ) {
      setPhotoError("Choose a JPG, PNG, or WebP image smaller than 4 MB.");
    }

    if (
      nextName.length < 2 ||
      nextName.length > 64 ||
      (photoFile &&
        (!ALLOWED_PHOTO_TYPES.has(photoFile.type) ||
          photoFile.size > MAX_PHOTO_SIZE))
    ) {
      return;
    }

    setSaving(true);

    try {
      const profileForm = new FormData();
      profileForm.set("name", nextName);
      if (photoFile) {
        profileForm.set("photo", photoFile);
      }

      const response = await fetch("/api/profile/photo", {
        method: "POST",
        body: profileForm,
      });
      const result = (await response.json()) as {
        imageUrl?: string;
        error?: string;
      };

      if (!response.ok) {
        setFormError(result.error || "Could not update your profile.");
        return;
      }

      const nextPhotoUrl = result.imageUrl ?? photoUrl;
      setName(nextName);
      setPhotoUrl(nextPhotoUrl);
      setPhotoFile(null);
      setPhotoPreview(null);
      if (photoInputRef.current) {
        photoInputRef.current.value = "";
      }
      toast.add({
        title: "Profile updated",
        description: "Your BookNook profile changes have been saved.",
        type: "success",
      });
      router.refresh();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? `Could not update your profile: ${error.message}`
          : "Could not update your profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-3xl border border-border/70 bg-card/60 p-6 shadow-sm sm:p-8">
      <div className="flex flex-col items-center gap-4 border-b border-border/70 pb-7 text-center sm:flex-row sm:text-left">
        <Avatar size="lg" className="size-20">
          <AvatarImage
            src={photoPreview ?? photoUrl ?? undefined}
            alt={`${name} profile`}
          />
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

          <Field data-invalid={photoError ? "true" : undefined}>
            <FieldLabel htmlFor="profile-photo">Profile photo</FieldLabel>
            <Input
              ref={photoInputRef}
              id="profile-photo"
              name="photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              aria-invalid={Boolean(photoError)}
            />
            <p className="text-xs text-muted-foreground">
              JPG, PNG, or WebP. Maximum file size: 4 MB.
            </p>
            {photoFile ? (
              <p className="text-xs text-muted-foreground">
                Selected: {photoFile.name}
              </p>
            ) : null}
            {photoError ? <FieldError>{photoError}</FieldError> : null}
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
              ) : photoFile ? (
                <ImagePlus className="size-4" />
              ) : (
                <Check className="size-4" />
              )}
              {saving
                ? photoFile
                  ? "Uploading and saving…"
                  : "Saving profile…"
                : "Save changes"}
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
