import { BookOpen, Undo2, UserPlus } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

const steps = [
  {
    icon: UserPlus,
    title: "Make a shelf account",
    text: "Sign up with your email or Google in under a minute. Your shelf and your borrows live in one quiet place.",
  },
  {
    icon: BookOpen,
    title: "Borrow for seven days",
    text: "Open any book, choose Borrow, and it appears in My Borrows with a clear return date. No checkout desk required.",
  },
  {
    icon: Undo2,
    title: "Return and pass it on",
    text: "Finished early? Return the book with one click and the copy goes back to the shelf for the next reader.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-border/60 bg-card/25">
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6">
        <SectionHeading
          eyebrow="How it works"
          title="Borrowing, without the paperwork."
          description="BookNook keeps the whole loop simple: add a book, borrow a book, return a book."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-border/70 bg-background/60 p-6"
            >
              <span className="absolute top-4 right-5 font-display text-4xl font-semibold text-primary/15">
                0{index + 1}
              </span>

              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <step.icon className="size-5" />
              </span>

              <h3 className="mt-5 font-display text-xl font-semibold">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
