import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Book } from "@/types/book";

export function BookCard({
  book,
  priority = false,
}: {
  book: Book;
  priority?: boolean;
}) {
  const isAvailable = book.availableCopies > 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/60 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-black/10">
      <div className="relative aspect-2/3 overflow-hidden bg-muted">
        <Image
          src={book.imageUrl}
          alt={`Cover of ${book.title}`}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />

        <Badge className="absolute top-3 left-3 shadow-sm">
          {book.category}
        </Badge>

        {!isAvailable ? (
          <Badge
            variant="secondary"
            className="absolute top-3 right-3 bg-background/90 text-foreground backdrop-blur"
          >
            All copies out
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 font-display text-xl leading-snug font-semibold">
          {book.title}
        </h3>
        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
          by {book.author}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="text-xs text-muted-foreground">
            {book.availableCopies} of {book.totalCopies} available
          </span>

          <Button
            variant="ghost"
            size="sm"
            className="-mr-2 gap-1 px-2 text-primary hover:bg-primary/10 hover:text-primary"
            nativeButton={false}
            render={<Link href={`/books/${book._id}`} />}
          >
            View Details
            <ArrowUpRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </article>
  );
}
