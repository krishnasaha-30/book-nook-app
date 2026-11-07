"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
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
};

type Slide = {
  eyebrow: string;
  title: string;
  text: string;
  footnote: string;
  image: string;
  imageAlt: string;
  covers: Cover[];
};

const libraryBackground =
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=2000&q=85";

const slides: Slide[] = [
  {
    eyebrow: "Welcome to BookNook",
    title: "A shelf that belongs to everyone.",
    text: "Add the books you love, borrow what you are curious about, and return them when you are done. The collection grows every time a reader shares.",
    footnote: "Browse the full shelf — no account needed.",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Shelves lined with books in a welcoming library",
    covers: [
      {
        title: "The Night Circus",
        author: "Erin Morgenstern",
        category: "Fiction",
      },
      {
        title: "Cosmos",
        author: "Carl Sagan",
        category: "Science",
      },
      {
        title: "Sapiens",
        author: "Yuval Noah Harari",
        category: "History",
      },
    ],
  },
  {
    eyebrow: "Borrowing, simplified",
    title: "Seven days. Zero late fees.",
    text: "Every borrow lasts a week. Return the book when you finish, or keep it until the due date — there is no fine print and no rush.",
    footnote: "Track every due date from My Borrows.",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "A quiet library filled with rows of books",
    covers: [
      {
        title: "Dune",
        author: "Frank Herbert",
        category: "Science",
      },
      {
        title: "Educated",
        author: "Tara Westover",
        category: "History",
      },
      {
        title: "The Hobbit",
        author: "J. R. R. Tolkien",
        category: "Fiction",
      },
    ],
  },
  {
    eyebrow: "A quieter kind of discovery",
    title: "Find your next quiet obsession.",
    text: "From midnight mysteries to big ideas and small adventures, the shelf changes as readers add to it. There is always one more book waiting.",
    footnote: "New arrivals land on the home page every week.",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "A reader holding an open book",
    covers: [
      {
        title: "Project Hail Mary",
        author: "Andy Weir",
        category: "Science",
      },
      {
        title: "Atomic Habits",
        author: "James Clear",
        category: "Others",
      },
      {
        title: "The Silent Patient",
        author: "Alex Michaelides",
        category: "Fiction",
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

function FeaturedBook({ slide }: { slide: Slide }) {
  const featuredBook = slide.covers[0];

  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-3xl border border-white/15 bg-white/5 shadow-2xl shadow-black/35">
      <Image
        src={slide.image}
        alt={slide.imageAlt}
        fill
        sizes="(max-width: 1024px) 100vw, 45vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-black/15" />

      <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md sm:top-5 sm:left-5">
        <BookOpen className="size-3.5 text-[#e7cf9b]" />
        A reader&apos;s corner
      </div>

      <div className="absolute right-4 bottom-4 left-4 rounded-2xl border border-white/20 bg-black/35 p-4 text-white backdrop-blur-xl sm:right-5 sm:bottom-5 sm:left-5 sm:p-5">
        <p className="text-[10px] font-medium tracking-[0.2em] text-[#e7cf9b] uppercase">
          Featured read · {featuredBook.category}
        </p>
        <p className="mt-2 font-display text-xl leading-tight font-semibold sm:text-2xl">
          {featuredBook.title}
        </p>
        <p className="mt-1 text-sm text-white/65">{featuredBook.author}</p>
      </div>
    </div>
  );
}

function SlidePanel({ slide, index }: { slide: Slide; index: number }) {
  return (
    <div
      className="relative isolate overflow-hidden bg-[#10120f] px-6 pt-12 pb-24 sm:px-10 lg:px-14 lg:pt-16"
    >
      <Image
        src={libraryBackground}
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/45" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-black/70 via-black/35 to-black/20" />

      <span className="absolute top-6 right-6 z-10 text-[10px] tracking-[0.3em] text-white/55">
        0{index + 1} / 0{slides.length}
      </span>

      <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
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

        <FeaturedBook slide={slide} />
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
