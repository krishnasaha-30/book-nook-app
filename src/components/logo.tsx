import Link from "next/link";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} home`}
      className={cn("group flex items-center gap-2.5", className)}
    >
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:-rotate-6">
        <BookOpen className="size-5" strokeWidth={2.2} />
      </span>
      <span className="font-display text-2xl font-semibold tracking-tight">
        Book<span className="text-primary">Nook</span>
      </span>
    </Link>
  );
}
