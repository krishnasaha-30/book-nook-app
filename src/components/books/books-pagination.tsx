import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BooksPaginationProps = {
  page: number;
  totalPages: number;
  search: string;
  category: string;
  sort: "newest" | "oldest";
};

function buildPageHref(
  page: number,
  { search, category, sort }: Omit<BooksPaginationProps, "page" | "totalPages">,
) {
  const params = new URLSearchParams();

  if (search) params.set("search", search);
  if (category) params.set("category", category);
  if (sort === "oldest") params.set("sort", sort);
  if (page > 1) params.set("page", String(page));

  const queryString = params.toString();
  return queryString ? `/books?${queryString}` : "/books";
}

function getPageNumbers(page: number, totalPages: number) {
  const numbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  if (totalPages <= 7) {
    return numbers;
  }

  return numbers.filter(
    (number) =>
      number === 1 ||
      number === totalPages ||
      Math.abs(number - page) <= 1,
  );
}

export function BooksPagination({
  page,
  totalPages,
  search,
  category,
  sort,
}: BooksPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const filters = { search, category, sort };
  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <nav
      aria-label="Books pagination"
      className="mt-12 flex items-center justify-center gap-1.5"
    >
      {page > 1 ? (
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1 pr-3.5 pl-2.5"
          nativeButton={false}
          render={<Link href={buildPageHref(page - 1, filters)} />}
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1 pr-3.5 pl-2.5"
          disabled
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>
      )}

      <div className="mx-1 flex items-center gap-1.5">
        {pageNumbers.map((number, index) => {
          const previous = pageNumbers[index - 1];
          const showGap = previous !== undefined && number - previous > 1;

          return (
            <span key={number} className="flex items-center gap-1.5">
              {showGap ? (
                <span className="px-1 text-xs text-muted-foreground">…</span>
              ) : null}

              <Link
                href={buildPageHref(number, filters)}
                aria-current={number === page ? "page" : undefined}
                className={cn(
                  "flex size-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors",
                  number === page
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/80 text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {number}
              </Link>
            </span>
          );
        })}
      </div>

      {page < totalPages ? (
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1 pr-2.5 pl-3.5"
          nativeButton={false}
          render={<Link href={buildPageHref(page + 1, filters)} />}
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1 pr-2.5 pl-3.5"
          disabled
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      )}
    </nav>
  );
}
