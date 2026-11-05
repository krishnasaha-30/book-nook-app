import Link from "next/link";
import {
  ArrowRight,
  BookMarked,
  CalendarDays,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const covers = [
  {
    title: "The Night Circus",
    author: "Erin Morgenstern",
    category: "Fiction",
    cover: "from-[#1d3f36] via-[#142b25] to-[#0b1713]",
    accent: "text-[#e6cd93]",
    lift: "",
  },
  {
    title: "Cosmos",
    author: "Carl Sagan",
    category: "Science",
    cover: "from-[#2c2449] via-[#1b1631] to-[#0d0a1a]",
    accent: "text-[#cbb8ff]",
    lift: "lg:-translate-y-6",
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "History",
    cover: "from-[#4c2b2b] via-[#301b1b] to-[#180d0d]",
    accent: "text-[#f2cba9]",
    lift: "",
  },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <section className="mx-auto grid max-w-7xl items-center gap-16 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pb-28 lg:pt-24">
        <div>
          <p className="flex items-center gap-3 text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
            <span className="h-px w-8 bg-primary" />
            A small online library
          </p>

          <h1 className="mt-6 font-display text-5xl leading-[0.98] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Wander into a{" "}
            <span className="text-gradient-gold italic">good book.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            BookNook is a shared shelf for curious readers. Add the books you
            love, borrow from the community, and return them when you are done —
            no late fees, no noise.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              className="h-11 gap-2 px-6 text-sm"
              nativeButton={false}
              render={<Link href="/books" />}
            >
              Browse Books
              <ArrowRight className="size-4" />
            </Button>

            <p className="text-sm text-muted-foreground">
              No account needed to browse.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Users className="size-4 text-primary" />
              Community shelves
            </span>
            <span className="flex items-center gap-2">
              <CalendarDays className="size-4 text-primary" />
              7-day borrows
            </span>
            <span className="flex items-center gap-2">
              <BookMarked className="size-4 text-primary" />
              Return anytime
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute top-1/2 left-1/2 size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative grid grid-cols-3 gap-3 sm:gap-4">
            {covers.map((book) => (
              <div
                key={book.title}
                className={`group relative aspect-2/3 overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br ${book.cover} p-3 shadow-2xl shadow-black/40 transition-transform duration-500 hover:-translate-y-2 sm:p-4 ${book.lift}`}
              >
                <div className="absolute inset-y-0 left-0 w-1.5 bg-black/25" />
                <div className="absolute inset-y-0 left-1.5 w-px bg-white/10" />

                <div className="relative flex h-full flex-col justify-between pl-1.5">
                  <span className="text-[9px] font-medium tracking-[0.2em] text-white/50 uppercase">
                    {book.category}
                  </span>

                  <div>
                    <p
                      className={`font-display text-base leading-tight font-semibold sm:text-lg ${book.accent}`}
                    >
                      {book.title}
                    </p>
                    <p className="mt-1.5 text-[10px] text-white/50 sm:text-xs">
                      {book.author}
                    </p>
                  </div>
                </div>

                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card/95 px-4 py-3 shadow-xl backdrop-blur">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Sparkles className="size-4" />
              </span>
              <div>
                <p className="text-xs font-medium">Fresh from the shelf</p>
                <p className="text-xs text-muted-foreground">
                  New arrivals added weekly
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
