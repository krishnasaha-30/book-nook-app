import { Spinner } from "@/components/ui/spinner";

export function BookGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
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
  );
}

export function BooksBrowserSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-6">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Spinner className="size-5 text-primary" />
        Loading the shelf…
      </div>

      <div className="mt-6 h-11 w-full max-w-xl animate-pulse rounded-lg bg-muted" aria-hidden="true" />
      <div className="mt-6 flex flex-wrap gap-2" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-8 w-20 animate-pulse rounded-full bg-muted"
          />
        ))}
      </div>

      <BookGridSkeleton />
    </div>
  );
}
