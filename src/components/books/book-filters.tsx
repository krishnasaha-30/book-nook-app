import Link from "next/link";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BOOK_CATEGORIES } from "@/lib/books";
import { cn } from "@/lib/utils";

type BookFiltersProps = {
  search: string;
  category: string;
  sort: "newest" | "oldest";
  total: number;
};

function buildHref({
  search,
  category,
  sort,
}: {
  search: string;
  category: string;
  sort: "newest" | "oldest";
}) {
  const params = new URLSearchParams();

  if (search) params.set("search", search);
  if (category) params.set("category", category);
  if (sort === "oldest") params.set("sort", sort);

  const queryString = params.toString();
  return queryString ? `/books?${queryString}` : "/books";
}

export function BookFilters({
  search,
  category,
  sort,
  total,
}: BookFiltersProps) {
  const filters = { search, category, sort };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <form
          action="/books"
          method="get"
          className="flex w-full max-w-xl items-center gap-2"
        >
          {category ? <input type="hidden" name="category" value={category} /> : null}
          {sort === "oldest" ? (
            <input type="hidden" name="sort" value={sort} />
          ) : null}

          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              name="search"
              defaultValue={search}
              placeholder="Search by title or author"
              aria-label="Search books by title or author"
              className="h-11 w-full rounded-lg border border-border/80 bg-background/60 pr-4 pl-10 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring/30"
            />
          </div>

          <Button type="submit" className="h-11 px-5">
            Search
          </Button>

          {search ? (
            <Button
              variant="ghost"
              size="icon"
              className="size-11 shrink-0"
              aria-label="Clear search"
              nativeButton={false}
              render={<Link href={buildHref({ ...filters, search: "" })} />}
            >
              <X className="size-4" />
            </Button>
          ) : null}
        </form>

        <div className="flex w-fit items-center gap-1 rounded-full border border-border/70 bg-card/50 p-1">
          {(
            [
              { value: "newest", label: "Newest" },
              { value: "oldest", label: "Oldest" },
            ] as const
          ).map((option) => (
            <Link
              key={option.value}
              href={buildHref({ ...filters, sort: option.value })}
              aria-current={sort === option.value ? "true" : undefined}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                sort === option.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={buildHref({ ...filters, category: "" })}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
            category === ""
              ? "border-primary bg-primary/15 text-primary"
              : "border-border/80 text-muted-foreground hover:border-primary/40 hover:text-foreground",
          )}
        >
          All books
        </Link>

        {BOOK_CATEGORIES.map((option) => (
          <Link
            key={option}
            href={buildHref({ ...filters, category: option })}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              category === option
                ? "border-primary bg-primary/15 text-primary"
                : "border-border/80 text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {option}
          </Link>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        {total === 0
          ? "No books match these filters"
          : `${total} ${total === 1 ? "book" : "books"} on this shelf`}
        {search ? ` for “${search}”` : ""}
      </p>
    </div>
  );
}
