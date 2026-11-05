import { Star } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

const reviews = [
  {
    quote:
      "I found three books here that I never would have picked up in a shop. The seven-day window keeps me reading instead of collecting.",
    name: "Nusrat A.",
    detail: "Fiction reader",
  },
  {
    quote:
      "Adding my own shelf took a minute, and now a stranger is reading my copy of Dune. That is the whole point of a library.",
    name: "Tanvir H.",
    detail: "Community member",
  },
  {
    quote:
      "No late fees, no complicated checkout. Just a quiet place to find the next book and bring it back when I am done.",
    name: "Mariam K.",
    detail: "Weekend reader",
  },
];

export function ReaderReviews() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6">
      <SectionHeading
        eyebrow="From our readers"
        title="Small library, loud recommendations."
        description="A few notes from the people who keep the shelves moving."
      />

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {reviews.map((review) => (
          <figure
            key={review.name}
            className="flex h-full flex-col rounded-2xl border border-border/70 bg-card/50 p-6"
          >
            <div className="flex gap-1 text-primary">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="size-3.5 fill-current" />
              ))}
            </div>

            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
              &ldquo;{review.quote}&rdquo;
            </blockquote>

            <figcaption className="mt-5 border-t border-border/60 pt-4">
              <p className="text-sm font-medium">{review.name}</p>
              <p className="text-xs text-muted-foreground">{review.detail}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
