import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { BookCard } from "@/components/books/book-card";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getLatestBooks } from "@/lib/api";

const GRID_CLASS = "mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3";

export async function NewArrivals() {
  const books = await getLatestBooks(6);

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6">
      <SectionHeading
        eyebrow="Fresh from the shelf"
        title="New arrivals"
        description="The latest books added by the BookNook community, newest first."
      />

      {books.length > 0 ? (
        <div className={GRID_CLASS}>
          {books.map((book, index) => (
            <BookCard key={book._id} book={book} priority={index < 3} />
          ))}
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-border/80 bg-card/40 px-6 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <BookOpen className="size-6" />
          </span>
          <h3 className="mt-4 font-display text-2xl font-semibold">
            The shelf is waiting
          </h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            No books have been added yet. Once readers start sharing, the six
            newest arrivals will show up here.
          </p>
          <Button
            className="mt-6"
            nativeButton={false}
            render={<Link href="/add-book" />}
          >
            Add the first book
          </Button>
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Button
          variant="outline"
          size="lg"
          className="h-11 gap-2 px-6"
          nativeButton={false}
          render={<Link href="/books" />}
        >
          See All Books
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}

export function NewArrivalsSkeleton() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Spinner className="size-5 text-primary" />
        Loading the newest books…
      </div>

      <div className={GRID_CLASS} aria-hidden="true">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-border/70 bg-card/40"
          >
            <div className="aspect-2/3 animate-pulse bg-muted" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
              <div className="h-4 w-2/5 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
