import { cache } from "react";
import { io } from "next/cache";
import type { Book, BookInput, Borrow } from "@/types/book";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type BookQuery = {
  search?: string;
  category?: string;
  sort?: "newest" | "oldest";
  limit?: number;
  ownerEmail?: string;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function buildQueryString(query: BookQuery) {
  const params = new URLSearchParams();

  if (query.search) params.set("search", query.search);
  if (query.category) params.set("category", query.category);
  if (query.sort) params.set("sort", query.sort);
  if (query.limit) params.set("limit", String(query.limit));
  if (query.ownerEmail) params.set("ownerEmail", query.ownerEmail);

  return params.toString();
}

type ApiRequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
  cache?: RequestCache;
};

/**
 * Low-level fetch for the Express API. Mutations must pass the Better Auth
 * JWT so the API's `verifyToken` middleware can validate the caller.
 */
export async function apiRequest<T>(
  path: string,
  { method = "GET", body, token, cache = "no-store" }: ApiRequestOptions = {},
): Promise<T> {
  const headers = new Headers();

  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache,
    });
  } catch (error) {
    console.error("Could not reach the BookNook API:", error);
    throw new ApiError("The library server is unreachable. Try again soon.", 0);
  }

  const payload = (await response.json().catch(() => null)) as
    | { message?: string }
    | null;

  if (!response.ok) {
    throw new ApiError(
      payload?.message ?? `The server rejected the request (${response.status}).`,
      response.status,
    );
  }

  return payload as T;
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

export function getBookCategories(): Promise<string[]> {
  return apiRequest<string[]>("/books/categories");
}

export async function getLatestBooks(limit = 6): Promise<Book[]> {
  return getBooks({ limit });
}

export async function getBooksByOwner(
  ownerEmail: string,
  limit = 100,
): Promise<Book[]> {
  return getBooks({ ownerEmail, limit });
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

export function createBook(input: BookInput, token: string): Promise<Book> {
  return apiRequest<Book>("/books", {
    method: "POST",
    body: input,
    token,
  });
}

export function updateBook(
  id: string,
  input: Partial<BookInput>,
  token: string,
): Promise<Book> {
  return apiRequest<Book>(`/books/${id}`, {
    method: "PATCH",
    body: input,
    token,
  });
}

export function deleteBook(id: string, token: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/books/${id}`, {
    method: "DELETE",
    token,
  });
}

export function borrowBook(bookId: string, token: string): Promise<Borrow> {
  return apiRequest<Borrow>("/borrows", {
    method: "POST",
    body: { bookId },
    token,
  });
}

export function getBorrows(token: string): Promise<Borrow[]> {
  return apiRequest<Borrow[]>("/borrows", { token });
}

export function returnBorrow(
  borrowId: string,
  token: string,
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/borrows/${borrowId}`, {
    method: "DELETE",
    token,
  });
}
