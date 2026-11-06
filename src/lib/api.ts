import { cache } from "react";
import { io } from "next/cache";
import type { Book } from "@/types/book";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type BookQuery = {
  search?: string;
  category?: string;
  sort?: "newest" | "oldest";
  limit?: number;
  ownerEmail?: string;
};

function buildQueryString(query: BookQuery) {
  const params = new URLSearchParams();

  if (query.search) params.set("search", query.search);
  if (query.category) params.set("category", query.category);
  if (query.sort) params.set("sort", query.sort);
  if (query.limit) params.set("limit", String(query.limit));
  if (query.ownerEmail) params.set("ownerEmail", query.ownerEmail);

  return params.toString();
}

export async function getBooks(query: BookQuery = {}): Promise<Book[]> {
  // Keep the request out of the static shell so every visitor sees the shelf
  // as it is right now.
  await io();

  const queryString = buildQueryString(query);
  const url = queryString ? `${API_URL}/books?${queryString}` : `${API_URL}/books`;

  try {
    const response = await fetch(url, { cache: "no-store" });

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

export async function getLatestBooks(limit = 6): Promise<Book[]> {
  return getBooks({ limit });
}

async function fetchBook(id: string): Promise<Book | null> {
  await io();

  try {
    const response = await fetch(`${API_URL}/books/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as Book;
  } catch (error) {
    console.error("Could not reach the BookNook API:", error);
    return null;
  }
}

// Memoised per request so the page and its generateMetadata share one call.
export const getBookById = cache(fetchBook);
