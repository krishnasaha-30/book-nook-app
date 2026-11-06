import Image from "next/image";
import Link from "next/link";
import { Library, Pencil } from "lucide-react";
import { DeleteBookButton } from "@/components/books/delete-book-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Book } from "@/types/book";

export function MyBookCard({ book }: { book: Book }) {
  const onLoan = Math.max(0, book.totalCopies - book.availableCopies);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/60">
      <div className="flex gap-4 p-4">
        <Link
          href={`/books/${book._id}`}
          className="relative aspect-2/3 w-24 shrink-0 overflow-hidden rounded-lg bg-muted"
        >
          <Image
            src={book.imageUrl}
            alt={`Cover of ${book.title}`}
            fill
            sizes="96px"
            className="object-cover"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <Badge variant="secondary">{book.category}</Badge>
          <h2 className="mt-2 line-clamp-2 font-display text-lg leading-snug font-semibold">
            <Link href={`/books/${book._id}`} className="hover:text-primary">
              {book.title}
            </Link>
          </h2>
          <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
            by {book.author}
          </p>

          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Library className="size-3.5 text-primary" />
            {book.availableCopies} of {book.totalCopies} available
            {onLoan > 0 ? ` · ${onLoan} on loan` : ""}
          </p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/60 px-4 py-2.5">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 px-2 text-muted-foreground hover:text-foreground"
          nativeButton={false}
          render={<Link href={`/my-books/${book._id}/edit`} />}
        >
          <Pencil className="size-4" />
          Edit
        </Button>

        <DeleteBookButton bookId={book._id} title={book.title} />
      </div>
    </article>
  );
}
