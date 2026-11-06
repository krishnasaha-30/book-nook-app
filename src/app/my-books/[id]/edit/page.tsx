import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { EditBookForm } from "@/components/books/edit-book-form";
import { PageHeader } from "@/components/page-header";
import { Spinner } from "@/components/ui/spinner";
import { getBookById } from "@/lib/api";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Edit book",
  description: "Update the details of a book on your BookNook shelf.",
};

type EditBookPageProps = {
  params: Promise<{ id: string }>;
};

async function EditBookGate({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?redirect=/my-books/${id}/edit`);
  }

  const book = await getBookById(id);

  if (!book) {
    notFound();
  }

  if (book.ownerEmail.toLowerCase() !== user.email.toLowerCase()) {
    redirect("/my-books?denied=1");
  }

  return <EditBookForm book={book} />;
}

export default function EditBookPage({ params }: EditBookPageProps) {
  return (
    <>
      <PageHeader
        eyebrow="Your shelf"
        title="Edit this book."
        description="Fix a typo, change the cover, or adjust how many copies you have. Borrowed copies stay with their readers."
      />

      <section className="mx-auto w-full max-w-5xl px-5 pb-24 sm:px-6">
        <div className="rounded-3xl border border-border/70 bg-card/50 p-6 shadow-2xl shadow-black/10 sm:p-8">
          <Suspense
            fallback={
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Spinner className="size-5 text-primary" />
                Opening the editor…
              </div>
            }
          >
            <EditBookGate params={params} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
