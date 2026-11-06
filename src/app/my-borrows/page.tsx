import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { differenceInCalendarDays, format } from "date-fns";
import { BookOpen, CalendarDays, Clock } from "lucide-react";
import { ReturnBookButton } from "@/components/books/return-book-button";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBorrows } from "@/lib/api";
import { getAccessToken, getCurrentUser } from "@/lib/session";
import type { Borrow } from "@/types/book";

export const metadata: Metadata = {
  title: "My borrows",
  description: "The books you have borrowed and when they are due back.",
};

function dueLabel(borrow: Borrow) {
  const days = differenceInCalendarDays(
    new Date(borrow.returnDate),
    new Date(),
  );

  if (days < 0) {
    return { label: `Overdue by ${Math.abs(days)} days`, urgent: true };
  }

  if (days === 0) {
    return { label: "Due today", urgent: true };
  }

  return {
    label: days === 1 ? "Due tomorrow" : `Due in ${days} days`,
    urgent: days <= 2,
  };
}

async function MyBorrowsContent() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/my-borrows");
  }

  const token = await getAccessToken();

  if (!token) {
    redirect("/login?redirect=/my-borrows");
  }

  const borrows = await getBorrows(token);

  if (borrows.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-border/80 bg-card/40 px-6 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <BookOpen className="size-6" />
        </span>
        <h2 className="mt-4 font-display text-2xl font-semibold">
          Nothing borrowed right now
        </h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Browse the shelf and borrow a book for seven days. It will appear here
          with its return date.
        </p>
        <Button
          className="mt-6"
          nativeButton={false}
          render={<Link href="/books" />}
        >
          Browse all books
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {borrows.length === 1
          ? "You have 1 book out on loan."
          : `You have ${borrows.length} books out on loan.`}
      </p>

      <div className="grid gap-4">
        {borrows.map((borrow) => {
          const due = dueLabel(borrow);

          return (
            <article
              key={borrow._id}
              className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card/60 p-4 sm:flex-row sm:items-center"
            >
              <Link
                href={`/books/${borrow.bookId}`}
                className="relative aspect-2/3 w-20 shrink-0 overflow-hidden rounded-lg bg-muted"
              >
                <Image
                  src={borrow.bookImage}
                  alt={`Cover of ${borrow.bookTitle}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </Link>

              <div className="min-w-0 flex-1">
                <h2 className="font-display text-lg leading-snug font-semibold">
                  <Link
                    href={`/books/${borrow.bookId}`}
                    className="hover:text-primary"
                  >
                    {borrow.bookTitle}
                  </Link>
                </h2>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="size-3.5 text-primary" />
                    Borrowed {format(new Date(borrow.borrowDate), "d MMM yyyy")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5 text-primary" />
                    Return by {format(new Date(borrow.returnDate), "d MMM yyyy")}
                  </span>
                </div>

                <Badge
                  variant={due.urgent ? "destructive" : "secondary"}
                  className="mt-3"
                >
                  {due.label}
                </Badge>
              </div>

              <ReturnBookButton borrowId={borrow._id} />
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default function MyBorrowsPage() {
  return (
    <>
      <PageHeader
        eyebrow="On loan"
        title="Books in your care."
        description="Everything you have borrowed from the BookNook shelf, with the day it is due back. Return a book here whenever you are finished with it."
      />

      <section className="mx-auto w-full max-w-5xl px-5 pb-24 sm:px-6">
        <Suspense
          fallback={
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-32 animate-pulse rounded-2xl border border-border/70 bg-muted/30"
                />
              ))}
            </div>
          }
        >
          <MyBorrowsContent />
        </Suspense>
      </section>
    </>
  );
}
