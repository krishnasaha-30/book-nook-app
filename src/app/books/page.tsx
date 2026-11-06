import type { Metadata } from "next";
import { Suspense } from "react";
import { BooksBrowser } from "@/components/books/books-browser";
import { BooksBrowserSkeleton } from "@/components/books/books-skeleton";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "All Books",
  description:
    "Browse every book on the BookNook shelf. Search by title or author, filter by category, and borrow for seven days.",
};

type BooksPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function BooksPage({ searchParams }: BooksPageProps) {
  return (
    <>
      <PageHeader
        eyebrow="The whole shelf"
        title="Every book, one quiet room."
        description="Search by title or author, filter by category, and find the copy you want to take home for the next seven days."
      />

      <Suspense fallback={<BooksBrowserSkeleton />}>
        <BooksBrowser searchParams={searchParams} />
      </Suspense>
    </>
  );
}
