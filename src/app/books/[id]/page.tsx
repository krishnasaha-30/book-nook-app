import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Library,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { BookCard } from "@/components/books/book-card";
import { BorrowButton } from "@/components/books/borrow-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBookById, getBooks } from "@/lib/api";
import { isBookCategory } from "@/lib/books";
import { getCurrentUser } from "@/lib/session";
import BookDetailsLoading from "./loading";

type BookDetailsProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: BookDetailsProps): Promise<Metadata> {
  const user = await getCurrentUser();

  if (!user) {
    return { title: "Book details" };
  }

  const { id } = await params;
  const book = await getBookById(id);

  if (!book) {
    return { title: "Book not found" };
  }

  return {
    title: book.title,
    description: book.description.slice(0, 160),
  };
}

async function getRelatedBooks(bookId: string, category: string) {
  const related = await getBooks({
    category: isBookCategory(category) ? category : undefined,
    limit: 4,
  });

  const sameCategory = related.filter((book) => book._id !== bookId);

  if (sameCategory.length > 0) {
    return sameCategory.slice(0, 3);
  }

  const latest = await getBooks({ limit: 4 });
  return latest.filter((book) => book._id !== bookId).slice(0, 3);
}

async function BookDetailsContent({ params }: BookDetailsProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(`/books/${id}`)}`);
  }

  const book = await getBookById(id);

  if (!book) {
    notFound();
  }

  const relatedBooks = await getRelatedBooks(book._id, book.category);
  const borrowedCopies = Math.max(0, book.totalCopies - book.availableCopies);
  const isAvailable = book.availableCopies > 0;
  const availabilityPercent =
    book.totalCopies > 0
      ? Math.round((book.availableCopies / book.totalCopies) * 100)
      : 0;

  const ownerInitials =
    book.ownerName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("") || "BN";

  return (
    <div>
      <div className="mx-auto w-full max-w-7xl px-5 pt-10 sm:px-6">
        <Link
          href="/books"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Back to all books
        </Link>
      </div>

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-10 sm:px-6 lg:grid-cols-[360px_1fr] lg:gap-16 lg:py-14">
        <div className="mx-auto w-full max-w-xs lg:sticky lg:top-28 lg:mx-0 lg:max-w-none">
          <div className="relative aspect-2/3 overflow-hidden rounded-2xl border border-border/70 bg-muted shadow-2xl shadow-black/30">
            <Image
              src={book.imageUrl}
              alt={`Cover of ${book.title}`}
              fill
              priority
              sizes="(max-width: 1024px) 60vw, 360px"
              className="object-cover"
            />
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{book.category}</Badge>
            <Badge
              variant={isAvailable ? "secondary" : "destructive"}
              className="gap-1"
            >
              {isAvailable ? (
                <CheckCircle2 className="size-3.5" />
              ) : (
                <Library className="size-3.5" />
              )}
              {isAvailable ? "Available to borrow" : "All copies are out"}
            </Badge>
          </div>

          <h1 className="mt-4 font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
            {book.title}
          </h1>

          <p className="mt-3 text-base text-muted-foreground">
            by <span className="text-foreground">{book.author}</span>
          </p>

          <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
            {book.description}
          </p>

          <dl className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {[
              { label: "Total copies", value: book.totalCopies },
              { label: "Available", value: book.availableCopies },
              { label: "On loan", value: borrowedCopies },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border/70 bg-card/50 px-4 py-3"
              >
                <dt className="text-[11px] tracking-wide text-muted-foreground uppercase">
                  {stat.label}
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 max-w-xl">
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${availabilityPercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {book.availableCopies} of {book.totalCopies} copies are on the
              shelf right now
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-border/70 bg-card/50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 font-display text-sm font-semibold text-primary">
                {ownerInitials}
              </span>
              <div>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <UserRound className="size-3.5" />
                  Shared by
                </p>
                <p className="text-sm font-medium">
                  {book.ownerName || "A BookNook reader"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-4 text-primary" />
                7-day loan
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-primary" />
                No late fees
              </span>
            </div>
          </div>

          <div className="mt-8">
            <BorrowButton bookId={book._id} isAvailable={isAvailable} />
          </div>
        </div>
      </section>

      {relatedBooks.length > 0 ? (
        <section className="border-t border-border/60 bg-card/20">
          <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="flex items-center gap-3 text-xs font-medium tracking-[0.24em] text-primary uppercase">
                  <span className="h-px w-8 bg-primary" />
                  Keep browsing
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
                  More in {book.category}
                </h2>
              </div>

              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href={`/books?category=${book.category}`} />}
              >
                See all {book.category}
              </Button>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedBooks.map((relatedBook) => (
                <BookCard key={relatedBook._id} book={relatedBook} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default function BookDetailsPage({ params }: BookDetailsProps) {
  return (
    <Suspense fallback={<BookDetailsLoading />}>
      <BookDetailsContent params={params} />
    </Suspense>
  );
}
