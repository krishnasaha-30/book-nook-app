import Link from "next/link";
import { BookX, Library } from "lucide-react";
import { BookCard } from "@/components/books/book-card";
import { BookFilters } from "@/components/books/book-filters";
import { BooksPagination } from "@/components/books/books-pagination";
import { Button } from "@/components/ui/button";
import { getBooks } from "@/lib/api";
import {
  BOOKS_PAGE_SIZE,
  getBookCategories,
  isBookCategory,
} from "@/lib/books";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function BooksBrowser({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const search = (firstValue(params.search) ?? "").trim();
  const rawCategory = (firstValue(params.category) ?? "").trim();
  const category = isBookCategory(rawCategory) ? rawCategory : "";
  const sort = firstValue(params.sort) === "oldest" ? "oldest" : "newest";
  const requestedPage = Number(firstValue(params.page));

  const [books, allBooks] = await Promise.all([
    getBooks({ search, category, sort, limit: 100 }),
    getBooks({ limit: 100 }),
  ]);
  const categories = getBookCategories(
    allBooks.map((book) => book.category),
  );

  const totalPages = Math.max(1, Math.ceil(books.length / BOOKS_PAGE_SIZE));
  const page = Math.min(
    Math.max(1, Number.isFinite(requestedPage) ? Math.floor(requestedPage) : 1),
    totalPages,
  );
  const visibleBooks = books.slice(
    (page - 1) * BOOKS_PAGE_SIZE,
    page * BOOKS_PAGE_SIZE,
  );

  const hasFilters = Boolean(search || category);

  return (
    <div className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-6">
      <BookFilters
        search={search}
        category={category}
        categories={categories}
        sort={sort}
        total={books.length}
      />

      {visibleBooks.length > 0 ? (
        <>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleBooks.map((book, index) => (
              <BookCard
                key={book._id}
                book={book}
                priority={page === 1 && index < 3}
              />
            ))}
          </div>

          <BooksPagination
            page={page}
            totalPages={totalPages}
            search={search}
            category={category}
            sort={sort}
          />
        </>
      ) : (
        <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-border/80 bg-card/40 px-6 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            {hasFilters ? (
              <BookX className="size-6" />
            ) : (
              <Library className="size-6" />
            )}
          </span>

          <h2 className="mt-4 font-display text-2xl font-semibold">
            {hasFilters ? "Nothing matches that shelf" : "The shelf is empty"}
          </h2>

          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            {hasFilters
              ? "Try a different title, author or category — or clear the filters to see every book."
              : "No books have been added yet. Be the first reader to share one."}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {hasFilters ? (
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href="/books" />}
              >
                Clear filters
              </Button>
            ) : null}

            <Button nativeButton={false} render={<Link href="/add-book" />}>
              Add a book
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
