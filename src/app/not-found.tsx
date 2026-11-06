import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page slipped off the shelf.",
};

export default function NotFound() {
  return (
    <section className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <div className="pointer-events-none absolute top-10 left-1/2 size-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative">
        <p className="flex items-center justify-center gap-3 text-xs font-medium tracking-[0.24em] text-primary uppercase">
          <span className="h-px w-8 bg-primary" />
          404
          <span className="h-px w-8 bg-primary" />
        </p>

        <h1 className="mt-5 font-display text-5xl leading-[1.02] font-semibold tracking-tight text-balance sm:text-6xl">
          This page slipped
          <br />
          <span className="text-gradient-gold italic">off the shelf.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          The page you were looking for is not here. It may have been moved,
          returned, or never written at all.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button
            size="lg"
            className="h-11 gap-2 px-6"
            nativeButton={false}
            render={<Link href="/books" />}
          >
            <Compass className="size-4" />
            Browse the shelf
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-11 gap-2 px-6"
            nativeButton={false}
            render={<Link href="/" />}
          >
            <BookOpen className="size-4" />
            Back home
          </Button>
        </div>

        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-3.5" />
          BookNook
        </Link>
      </div>
    </section>
  );
}
