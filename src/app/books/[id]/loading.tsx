import { Spinner } from "@/components/ui/spinner";

export default function BookDetailsLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 pt-10 pb-24 sm:px-6">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Spinner className="size-5 text-primary" />
        Opening the book…
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[360px_1fr] lg:gap-16">
        <div className="mx-auto aspect-2/3 w-full max-w-xs animate-pulse rounded-2xl bg-muted lg:mx-0 lg:max-w-none" />

        <div className="space-y-5">
          <div className="flex gap-3">
            <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
            <div className="h-6 w-40 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="h-12 w-4/5 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
          <div className="space-y-3 pt-3">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          </div>
          <div className="grid max-w-xl grid-cols-3 gap-3 pt-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-xl bg-muted"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
