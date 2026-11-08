"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  ApiError,
  borrowBook,
  createBook,
  deleteBook,
  returnBorrow,
  updateBook,
} from "@/lib/api";
import type { ActionState } from "@/lib/action-state";
import { isBookCategory } from "@/lib/books";
import { getAccessToken } from "@/lib/session";
import type { BookInput } from "@/types/book";

function getMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

function readString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function readBookInput(formData: FormData): BookInput | string {
  const title = readString(formData, "title");
  const author = readString(formData, "author");
  const category = readString(formData, "category");
  const imageUrl = readString(formData, "imageUrl");
  const description = readString(formData, "description");
  const totalCopies = Number(readString(formData, "totalCopies") || "1");

  if (!title || !author || !imageUrl || !description) {
    return "Title, author, cover image and description are required.";
  }

  if (!isBookCategory(category)) {
    return "Enter a category using no more than 60 characters.";
  }

  if (!Number.isInteger(totalCopies) || totalCopies < 1 || totalCopies > 999) {
    return "Total copies must be a whole number between 1 and 999.";
  }

  return { title, author, category, imageUrl, description, totalCopies };
}

function refreshBookViews(bookId?: string) {
  revalidatePath("/");
  revalidatePath("/books");
  revalidatePath("/my-books");

  if (bookId) {
    revalidatePath(`/books/${bookId}`);
  }
}

export async function createBookAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const token = await getAccessToken();

  if (!token) {
    return { error: "Please sign in before adding a book." };
  }

  const input = readBookInput(formData);

  if (typeof input === "string") {
    return { error: input };
  }

  let newBookId: string;

  try {
    const book = await createBook(input, token);
    newBookId = book._id;
  } catch (error) {
    return { error: getMessage(error) };
  }

  refreshBookViews(newBookId);
  redirect(`/books/${newBookId}?added=1`);
}

export async function updateBookAction(
  bookId: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const token = await getAccessToken();

  if (!token) {
    return { error: "Please sign in before editing a book." };
  }

  const input = readBookInput(formData);

  if (typeof input === "string") {
    return { error: input };
  }

  try {
    await updateBook(bookId, input, token);
  } catch (error) {
    return { error: getMessage(error) };
  }

  refreshBookViews(bookId);
  revalidatePath(`/my-books/${bookId}/edit`);
  redirect("/my-books?updated=1");
}

export async function deleteBookAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const token = await getAccessToken();

  if (!token) {
    return { error: "Please sign in before removing a book." };
  }

  const bookId = readString(formData, "bookId");

  if (!bookId) {
    return { error: "The book could not be identified." };
  }

  try {
    await deleteBook(bookId, token);
  } catch (error) {
    return { error: getMessage(error) };
  }

  refreshBookViews();
  revalidatePath("/my-borrows");

  redirect("/my-books?removed=1");
}

export async function borrowBookAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const token = await getAccessToken();

  if (!token) {
    return { error: "Please sign in to borrow this book." };
  }

  const bookId = readString(formData, "bookId");

  if (!bookId) {
    return { error: "The book could not be identified." };
  }

  try {
    const borrow = await borrowBook(bookId, token);
    refreshBookViews(bookId);
    revalidatePath("/my-borrows");

    const due = new Date(borrow.returnDate).toLocaleDateString("en", {
      day: "numeric",
      month: "long",
    });

    return { message: `Borrowed — please return it by ${due}.` };
  } catch (error) {
    return { error: getMessage(error) };
  }
}

export async function returnBookAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const token = await getAccessToken();

  if (!token) {
    return { error: "Please sign in to return this book." };
  }

  const borrowId = readString(formData, "borrowId");

  if (!borrowId) {
    return { error: "The borrow record could not be identified." };
  }

  try {
    await returnBorrow(borrowId, token);
  } catch (error) {
    return { error: getMessage(error) };
  }

  refreshBookViews();
  revalidatePath("/my-borrows");

  return { message: "Returned to the shelf. Thank you!" };
}
