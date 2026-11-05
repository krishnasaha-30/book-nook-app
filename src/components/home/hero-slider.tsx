"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Button } from "@/components/ui/button";
import "swiper/css";

type Cover = {
  title: string;
  author: string;
  category: string;
  cover: string;
  accent: string;
  lift?: string;
};

type Slide = {
  eyebrow: string;
  title: string;
  text: string;
  footnote: string;
  theme: string;
  covers: Cover[];
};

const slides: Slide[] = [
  {
    eyebrow: "Welcome to BookNook",
    title: "A shelf that belongs to everyone.",
    text: "Add the books you love, borrow what you are curious about, and return them when you are done. The collection grows every time a reader shares.",
    footnote: "Browse the full shelf — no account needed.",
    theme: "from-[#123c31] via-[#0e2a23] to-[#091713]",
    covers: [
      {
        title: "The Night Circus",
        author: "Erin Morgenstern",
        category: "Fiction",
        cover: "from-[#1d3f36] via-[#142b25] to-[#0b1713]",
        accent: "text-[#e6cd93]",
      },
      {
        title: "Cosmos",
        author: "Carl Sagan",
        category: "Science",
        cover: "from-[#2c2449] via-[#1b1631] to-[#0d0a1a]",
        accent: "text-[#cbb8ff]",
        lift: "-translate-y-4",
      },
      {
        title: "Sapiens",
        author: "Yuval Noah Harari",
        category: "History",
        cover: "from-[#4c2b2b] via-[#301b1b] to-[#180d0d]",
        accent: "text-[#f2cba9]",
      },
    ],
  },
  {
    eyebrow: "Borrowing, simplified",
    title: "Seven days. Zero late fees.",
    text: "Every borrow lasts a week. Return the book when you finish, or keep it until the due date — there is no fine print and no rush.",
    footnote: "Track every due date from My Borrows.",
    theme: "from-[#2c2550] via-[#1d1838] to-[#0e0b1d]",
    covers: [
      {
        title: "Dune",
        author: "Frank Herbert",
        category: "Science",
        cover: "from-[#5a3a1d] via-[#382410] to-[#1b1107]",
        accent: "text-[#f4d29a]",
      },
      {
        title: "Educated",
        author: "Tara Westover",
        category: "History",
        cover: "from-[#1f3b52] via-[#142a3b] to-[#0a1620]",
        accent: "text-[#c5e3f7]",
        lift: "-translate-y-4",
      },
      {
        title: "The Hobbit",
        author: "J. R. R. Tolkien",
        category: "Fiction",
        cover: "from-[#3d4a20] via-[#273016] to-[#141a0a]",
        accent: "text-[#dbe8a8]",
      },
    ],
  },
  {
    eyebrow: "A quieter kind of discovery",
    title: "Find your next quiet obsession.",
    text: "From midnight mysteries to big ideas and small adventures, the shelf changes as readers add to it. There is always one more book waiting.",
    footnote: "New arrivals land on the home page every week.",
    theme: "from-[#4a262b] via-[#2f181c] to-[#170b0e]",
    covers: [
      {
        title: "Project Hail Mary",
        author: "Andy Weir",
        category: "Science",
        cover: "from-[#1a3a4a] via-[#102632] to-[#08151b]",
        accent: "text-[#a8e0f2]",
      },
      {
        title: "Atomic Habits",
        author: "James Clear",
        category: "Others",
        cover: "from-[#4a3520] via-[#2d2013] to-[#17100a]",
        accent: "text-[#f0c78f]",
        lift: "-translate-y-4",
      },
      {
        title: "The Silent Patient",
        author: "Alex Michaelides",
        category: "Fiction",
        cover: "from-[#40202a] via-[#291319] to-[#150a0d]",
        accent: "text-[#f0b7c6]",
      },
    ],
  },
];

const emptySubscribe = () => () => {};

/**
 * Swiper reads the current time while rendering. Next.js refuses to prerender
 * that, so the slider is only mounted in the browser. The server and the first
 * client render show a static copy of the opening slide instead.
 */
function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

function BookTrio({ covers }: { covers: Cover[] }) {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto grid w-full max-w-sm grid-cols-3 gap-2.5 sm:gap-3"
    >
      {covers.map((book) => (
        <div
          key={book.title}
          className={`relative aspect-2/3 overflow-hidden rounded-xl border border-white/10 bg-linear-to-br p-2.5 shadow-2xl shadow-black/40 transition-transform duration-500 hover:-translate-y-2 sm:rounded-2xl sm:p-3 ${book.cover} ${book.lift ?? ""}`}
        >
          <div className="absolute inset-y-0 left-0 w-1 bg-black/25" />
          <div className="absolute inset-y-0 left-1 w-px bg-white/10" />

          <div className="relative flex h-full flex-col justify-between pl-1.5">
            <span className="text-[8px] font-medium tracking-[0.18em] text-white/50 uppercase">
              {book.category}
            </span>

            <div>
              <p
                className={`font-display text-xs leading-tight font-semibold sm:text-sm ${book.accent}`}
              >
                {book.title}
              </p>
              <p className="mt-1 text-[9px] text-white/50 sm:text-[10px]">
                {book.author}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SlidePanel({ slide, index }: { slide: Slide; index: number }) {
  return (
    <div
      className={`relative overflow-hidden bg-linear-to-br px-6 pt-12 pb-24 sm:px-10 lg:px-14 lg:pt-16 ${slide.theme}`}
    >
      <div className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-[#e2bf7a]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-16 size-72 rounded-full bg-white/5 blur-3xl" />

      <span className="absolute top-6 right-6 text-[10px] tracking-[0.3em] text-white/35">
        0{index + 1} / 0{slides.length}
      </span>

      <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="flex items-center gap-2 text-[10px] font-medium tracking-[0.24em] text-[#e7cf9b] uppercase sm:text-xs">
            <Sparkles className="size-3.5" />
            {slide.eyebrow}
          </p>

          <h2 className="mt-4 max-w-xl font-display text-4xl leading-[1.03] font-semibold tracking-tight text-balance text-white sm:text-5xl lg:text-6xl">
            {slide.title}
          </h2>

          <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/70 sm:text-base">
            {slide.text}
          </p>

          <Button
            size="lg"
            className="mt-8 h-11 gap-2 px-6"
            nativeButton={false}
            render={<Link href="/books" />}
          >
            Browse Books
            <ArrowRight className="size-4" />
          </Button>

          <p className="mt-4 text-xs text-white/45">{slide.footnote}</p>
        </div>

        <BookTrio covers={slide.covers} />
      </div>
    </div>
  );
}

export function HeroSlider() {
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <div className="booknook-swiper overflow-hidden rounded-3xl border border-white/10">
        <SlidePanel slide={slides[0]} index={0} />
      </div>
    );
  }

  return (
    <div className="relative">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true, el: ".booknook-pagination" }}
        navigation={{ prevEl: ".booknook-prev", nextEl: ".booknook-next" }}
        loop
        speed={700}
        autoHeight
        className="booknook-swiper overflow-hidden rounded-3xl border border-white/10"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.title}>
            <SlidePanel slide={slide} index={index} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="booknook-pagination absolute bottom-6 left-6 z-20 flex items-center gap-2 sm:left-10 lg:left-14" />

      <div className="absolute right-5 bottom-5 z-20 flex items-center gap-2 sm:right-8">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Previous slide"
          className="booknook-prev rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Next slide"
          className="booknook-next rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
