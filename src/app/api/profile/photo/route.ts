import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/session";

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const allowedTypes = new Map([
  ["image/jpeg", "jpeg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

type ProfilePhotoDocument = {
  userId: string;
  contentType: string;
  data: Buffer;
  updatedAt: Date;
};

function hasValidImageSignature(bytes: Buffer, format: string) {
  if (format === "jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (format === "png") {
    return bytes.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    );
  }

  return (
    bytes.toString("ascii", 0, 4) === "RIFF" &&
    bytes.toString("ascii", 8, 12) === "WEBP"
  );
}

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return new NextResponse(null, { status: 401 });
  }

  const photo = await db
    .collection<ProfilePhotoDocument>("profilePhotos")
    .findOne({ userId: user.id });

  if (!photo) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(new Uint8Array(photo.data), {
    headers: {
      "Content-Type": photo.contentType,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Please sign in to update your photo." },
      { status: 401 },
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

  const name = formData.get("name");

  if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 64) {
    return NextResponse.json(
      { error: "Name must be between 2 and 64 characters." },
      { status: 400 },
    );
  }

  const file = formData.get("photo");
  let imageUrl: string | undefined;

  if (file !== null && !(file instanceof File)) {
    return NextResponse.json(
      { error: "Choose a valid image file." },
      { status: 400 },
    );
  }

  if (file instanceof File) {
    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Choose an image smaller than 4 MB." },
        { status: 400 },
      );
    }

    const format = allowedTypes.get(file.type);

    if (!format) {
      return NextResponse.json(
        { error: "Use a JPG, PNG, or WebP image." },
        { status: 400 },
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());

    if (!hasValidImageSignature(bytes, format)) {
      return NextResponse.json(
        { error: "The selected file is not a valid image." },
        { status: 400 },
      );
    }

    const updatedAt = new Date();

    try {
      await db.collection<ProfilePhotoDocument>("profilePhotos").updateOne(
        { userId: user.id },
        {
          $set: {
            contentType: file.type,
            data: bytes,
            updatedAt,
          },
        },
        { upsert: true },
      );
    } catch (error) {
      console.error("Could not save profile photo to MongoDB.", error);
      return NextResponse.json(
        { error: "Could not save your photo. Check the MongoDB connection and try again." },
        { status: 500 },
      );
    }

    imageUrl = `/api/profile/photo?v=${updatedAt.getTime()}`;
  }

  try {
    await auth.api.updateUser({
      headers: await headers(),
      body: {
        name: name.trim(),
        ...(imageUrl ? { image: imageUrl } : {}),
      },
    });
  } catch (error) {
    console.error("Could not update the authenticated user profile.", error);
    return NextResponse.json(
      { error: "Your photo uploaded, but your profile could not be updated. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ imageUrl });
}
