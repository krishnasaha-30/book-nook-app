"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { AlertCircle, ImageIcon, Loader2, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";

type BookImageFieldProps = {
  initialUrl?: string;
  imageAlt?: string;
};

export function BookImageField({
  initialUrl = "",
  imageAlt = "Cover preview",
}: BookImageFieldProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [coverUrl, setCoverUrl] = useState(initialUrl);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];

    if (!file) {
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.set("image", file);

      const response = await fetch("/api/books/image", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json().catch(() => null)) as
        | { imageUrl?: unknown; error?: unknown }
        | null;

      if (!response.ok || typeof result?.imageUrl !== "string") {
        throw new Error(
          typeof result?.error === "string"
            ? result.error
            : "The cover could not be uploaded. Please try again.",
        );
      }

      setCoverUrl(result.imageUrl);
      setPreviewFailed(false);
      toast.add({
        title: "Cover uploaded",
        description: "The hosted image URL is ready to save with your book.",
        type: "success",
      });
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : "The cover could not be uploaded. Please try again.",
      );
    } finally {
      setIsUploading(false);

      if (fileInput.current) {
        fileInput.current.value = "";
      }
    }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Cover image URL</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          type="url"
          placeholder="Upload a cover or paste an image URL"
          required
          value={coverUrl}
          onChange={(event) => {
            setCoverUrl(event.target.value);
            setPreviewFailed(false);
          }}
          className="h-11"
        />
      </div>

      <input
        ref={fileInput}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        aria-label="Choose a cover image to upload"
        onChange={(event) => void uploadImage(event)}
      />
      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        disabled={isUploading}
        onClick={() => fileInput.current?.click()}
      >
        {isUploading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Upload className="size-4" />
        )}
        {isUploading ? "Uploading cover…" : "Upload a cover to ImgBB"}
      </Button>

      <div className="relative aspect-2/3 overflow-hidden rounded-2xl border border-border/70 bg-muted/40">
        {coverUrl && !previewFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt={imageAlt}
            className="size-full object-cover"
            onError={() => setPreviewFailed(true)}
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 px-6 text-center text-muted-foreground">
            <ImageIcon className="size-8" />
            <p className="text-xs">
              {previewFailed
                ? "That image could not be loaded. Double-check the URL."
                : "A cover preview will appear here."}
            </p>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        JPG, PNG, or WebP up to 10 MB. You can also paste a hosted image URL.
      </p>

      {uploadError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
