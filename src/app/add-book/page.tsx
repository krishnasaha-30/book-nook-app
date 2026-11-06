import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AddBookForm } from "@/components/books/add-book-form";
import { PageHeader } from "@/components/page-header";
import { Spinner } from "@/components/ui/spinner";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Add a book",
  description:
    "Share a book from your own shelf with the BookNook community.",
};

async function AddBookGate() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/add-book");
  }

  return <AddBookForm />;
}

function AddBookFallback() {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <Spinner className="size-5 text-primary" />
      Opening the add-book form…
    </div>
  );
}

export default function AddBookPage() {
  return (
    <>
      <PageHeader
        eyebrow="Share a book"
        title="Put a book on the shelf."
        description="Add the details of a book you own. Other readers can borrow it for seven days, and it comes back to you when they are done."
      />

      <section className="mx-auto w-full max-w-5xl px-5 pb-24 sm:px-6">
        <div className="rounded-3xl border border-border/70 bg-card/50 p-6 shadow-2xl shadow-black/10 sm:p-8">
          <Suspense fallback={<AddBookFallback />}>
            <AddBookGate />
          </Suspense>
        </div>
      </section>
    </>
  );
}
