import type { BookCategory } from "@/types/book";

export const BOOK_CATEGORIES: BookCategory[] = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

export const MAX_BOOK_CATEGORY_LENGTH = 60;

export const BOOKS_PAGE_SIZE = 9;

export function isBookCategory(value: string): boolean {
  const category = value.trim();
  return category.length > 0 && category.length <= MAX_BOOK_CATEGORY_LENGTH;
}

export function getBookCategories(categories: readonly string[] = []) {
  const seen = new Set<string>();
  const options: string[] = [];

  for (const category of [...BOOK_CATEGORIES, ...categories]) {
    const normalized = category.trim();
    const key = normalized.toLowerCase();

    if (!isBookCategory(normalized) || seen.has(key)) {
      continue;
    }

    seen.add(key);
    options.push(normalized);
  }

  return options;
}
