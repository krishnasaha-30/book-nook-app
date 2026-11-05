import { io } from "next/cache";
import type { Book } from "@/types/book";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function getLatestBooks(limit = 6): Promise<Book[]> {
  // Keep the request out of the static shell so every visitor sees the shelf
  // as it is right now.
  await io();

  try {
    const response = await fetch(`${API_URL}/books?limit=${limit}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Could not load books: ${response.status}`);
      return [];
    }

    return (await response.json()) as Book[];
  } catch (error) {
    console.error("Could not reach the BookNook API:", error);
    return [];
  }
}
