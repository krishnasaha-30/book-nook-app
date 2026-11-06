import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BookPlus, Library } from "lucide-react";
import { MyBookCard } from "@/components/books/my-book-card";
import { BooksBrowserSkeleton } from "@/components/books/books-skeleton";
import { PageHeader } from "@/components/page-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getBooksByOwner } from "@/lib/api";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "My books",
  description: "The books you have shared with the BookNook community.",
};

type MyBooksPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function MyBooksContent({
  searchParams,
}: {
  searchParams: MyBooksPageProps["searchParams"];
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/my-books");
  }

  const [books, params] = await Promise.all([
    getBooksByOwner(user.email),
    searchParams,
  ]);

  const denied = firstValue(params.denied) === "1";
  const updated = firstValue(params.updated) === "1";

  return (
    <>
      {denied ? (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            You can only edit books that you added to BookNook.
          </AlertDescription>
        </Alert>
      ) : null}

      {updated ? (
        <Alert className="mb-6 border-primary/30 bg-primary/10">
          <AlertDescription className="text-foreground">
            Your changes are saved.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {books.length === 0
            ? "You have not shared any books yet."
            : `You are sharing ${books.length} ${
                books.length === 1 ? "book" : "books"
              }.`}
        </p>

        <Button
          className="gap-2"
          nativeButton={false}
          render={<Link href="/add-book" />}
        >
          <BookPlus className="size-4" />
          Add a book
        </Button>
      </div>

      {books.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {books.map((book) => (
            <MyBookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border/80 bg-card/40 px-6 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Library className="size-6" />
          </span>
          <h2 className="mt-4 font-display text-2xl font-semibold">
            Your shelf is empty
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Add the first book you want to share. Other readers can borrow it
            for seven days, and it comes back to your shelf afterwards.
          </p>
          <Button
            className="mt-6 gap-2"
            nativeButton={false}
            render={<Link href="/add-book" />}
          >
            <BookPlus className="size-4" />
            Add your first book
          </Button>
        </div>
      )}
    </>
  );
}

export default function MyBooksPage({ searchParams }: MyBooksPageProps) {
  return (
    <>
      <PageHeader
        eyebrow="Your shelf"
        title="The books you share."
        description="Every copy you have added to BookNook, how many are on the shelf right now, and the tools to edit or remove them."
      />

      <section className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-6">
        <Suspense fallback={<BooksBrowserSkeleton />}>
          <MyBooksContent searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}
