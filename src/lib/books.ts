import type { BookCategory } from "@/types/book";

export const BOOK_CATEGORIES: BookCategory[] = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

export const BOOKS_PAGE_SIZE = 9;

export function isBookCategory(value: string): value is BookCategory {
  return BOOK_CATEGORIES.includes(value as BookCategory);
}
