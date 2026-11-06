import { BooksBrowserSkeleton } from "@/components/books/books-skeleton";

export default function BooksLoading() {
  return (
    <div className="pt-14">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6">
        <div className="h-3 w-32 animate-pulse rounded bg-muted" />
        <div className="mt-5 h-12 w-2/3 max-w-xl animate-pulse rounded bg-muted" />
        <div className="mt-4 h-4 w-full max-w-2xl animate-pulse rounded bg-muted" />
      </div>

      <div className="mt-12">
        <BooksBrowserSkeleton />
      </div>
    </div>
  );
}
