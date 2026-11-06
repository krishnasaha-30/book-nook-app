import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function hasValidImageSignature(bytes: Buffer, contentType: string) {
  if (contentType === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (contentType === "image/png") {
    return bytes.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    );
  }

  return (
    bytes.toString("ascii", 0, 4) === "RIFF" &&
    bytes.toString("ascii", 8, 12) === "WEBP"
  );
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Please sign in before uploading a cover." },
      { status: 401 },
    );
  }

  const apiKey = process.env.IMGBB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Book cover uploads are not configured yet." },
      { status: 503 },
    );
  }

  const contentLength = Number(request.headers.get("content-length"));

  if (Number.isFinite(contentLength) && contentLength > MAX_FILE_SIZE + 1_000_000) {
    return NextResponse.json(
      { error: "Choose an image smaller than 10 MB." },
      { status: 413 },
    );
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Choose an image to upload." },
      { status: 400 },
    );
  }

  const file = formData.get("image");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Choose a valid image file." },
      { status: 400 },
    );
  }

  if (file.size === 0 || file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Choose an image smaller than 10 MB." },
      { status: 400 },
    );
  }

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json(
      { error: "Use a JPG, PNG, or WebP cover image." },
      { status: 400 },
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  if (!hasValidImageSignature(bytes, file.type)) {
    return NextResponse.json(
      { error: "The selected file is not a valid image." },
      { status: 400 },
    );
  }

  const uploadData = new FormData();
  uploadData.set("image", new Blob([bytes], { type: file.type }), file.name);

  let uploadResponse: Response;

  try {
    uploadResponse = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        body: uploadData,
        cache: "no-store",
        signal: AbortSignal.timeout(20_000),
      },
    );
  } catch (error) {
    console.error("Could not reach ImgBB for a book cover upload.", error);
    return NextResponse.json(
      { error: "The image host could not be reached. Please try again." },
      { status: 502 },
    );
  }

  const result = (await uploadResponse.json().catch(() => null)) as
    | {
        success?: boolean;
        data?: { url?: unknown };
        error?: { message?: unknown };
      }
    | null;

  if (
    !uploadResponse.ok ||
    !result?.success ||
    typeof result.data?.url !== "string"
  ) {
    console.error("ImgBB rejected a book cover upload.", {
      status: uploadResponse.status,
      message: result?.error?.message,
    });
    return NextResponse.json(
      { error: "The image host could not save this cover. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ imageUrl: result.data.url });
}
