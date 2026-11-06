import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="pointer-events-none absolute -top-40 right-0 size-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-5 pt-12 pb-10 sm:px-6 lg:pt-16">
        <p className="flex items-center gap-3 text-xs font-medium tracking-[0.24em] text-primary uppercase">
          <span className="h-px w-8 bg-primary" />
          {eyebrow}
        </p>

        <h1 className="mt-4 font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
          {title}
        </h1>

        {description ? (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        ) : null}

        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </div>
  );
}
