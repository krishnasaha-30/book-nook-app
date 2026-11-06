import type { ReactNode } from "react";
import {
  BookOpenCheck,
  CalendarDays,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Spinner } from "@/components/ui/spinner";

type AuthShellProps = {
  eyebrow: string;
  panelTitle: string;
  highlights: string[];
  children: ReactNode;
};

const HIGHLIGHT_ICONS = [BookOpenCheck, CalendarDays, ShieldCheck];

export function AuthShell({
  eyebrow,
  panelTitle,
  highlights,
  children,
}: AuthShellProps) {
  return (
    <div className="mx-auto grid w-full max-w-7xl items-stretch gap-10 px-5 py-12 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:py-16">
      <section className="relative hidden overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-[#262c41] via-[#151a29] to-[#0a0d15] p-10 lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-[#d7b36a]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 size-72 rounded-full bg-white/5 blur-3xl" />

        <div className="relative">
          <Logo />

          <p className="mt-10 flex items-center gap-2 text-xs font-medium tracking-[0.24em] text-[#dcc17f] uppercase">
            <Sparkles className="size-3.5" />
            {eyebrow}
          </p>

          <h2 className="mt-4 max-w-sm font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance text-white">
            {panelTitle}
          </h2>

          <ul className="mt-8 space-y-5">
            {highlights.map((highlight, index) => {
              const Icon = HIGHLIGHT_ICONS[index % HIGHLIGHT_ICONS.length];

              return (
                <li key={highlight} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#dcc17f]">
                    <Icon className="size-4" />
                  </span>
                  <p className="max-w-xs text-sm leading-relaxed text-white/70">
                    {highlight}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="relative mt-10 text-xs text-white/45">
          One account for the whole community shelf.
        </p>
      </section>

      <section className="flex flex-1 items-center justify-center">
        <div className="glass-panel w-full max-w-md rounded-3xl border border-border/70 bg-card/50 p-7 shadow-xl backdrop-blur sm:p-9">
          {children}
        </div>
      </section>
    </div>
  );
}

export function AuthFormSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <Spinner className="size-6 text-primary" />
      <p className="text-sm text-muted-foreground">Loading the form…</p>
    </div>
  );
}
