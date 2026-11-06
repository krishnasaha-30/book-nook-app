"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, Menu, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks } from "@/lib/site";
import { cn } from "@/lib/utils";

// Replaced with the BetterAuth session in the authentication step.
const isLoggedIn: boolean = false;

function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function NavbarContent({ pathname }: { pathname: string | null }) {
  const visibleLinks = navLinks.filter(
    (link) => !("private" in link) || !link.private || isLoggedIn,
  );

  return (
    <header className="glass-panel sticky top-0 z-50 border-b border-border/70">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 sm:px-6">
        <Logo />

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          {visibleLinks.map((link) => {
            const active =
              pathname !== null && isActivePath(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm transition-colors",
                  active
                    ? "font-medium text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
                {active ? (
                  <span className="absolute inset-x-4 -bottom-0.5 h-px bg-primary" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          {isLoggedIn ? null : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="hidden h-9 px-3 sm:inline-flex"
                nativeButton={false}
                render={<Link href="/login" />}
              >
                <LogIn className="size-4" />
                Login
              </Button>
              <Button
                size="sm"
                className="hidden h-9 px-4 sm:inline-flex"
                nativeButton={false}
                render={<Link href="/register" />}
              >
                <UserPlus className="size-4" />
                Register
              </Button>
            </>
          )}

          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open navigation menu"
                />
              }
            >
              <Menu className="size-4" />
            </SheetTrigger>

            <SheetContent side="right" className="w-80">
              <SheetHeader className="border-b border-border/60 p-5">
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Browse BookNook pages and account options.
                </SheetDescription>
                <Logo />
              </SheetHeader>

              <nav
                aria-label="Mobile navigation"
                className="flex flex-col gap-1 px-3"
              >
                {visibleLinks.map((link) => (
                  <SheetClose
                    key={link.href}
                    nativeButton={false}
                    render={
                      <Link
                        href={link.href}
                        className={cn(
                          "rounded-lg px-3 py-2.5 text-sm transition-colors",
                          pathname !== null &&
                            isActivePath(pathname, link.href)
                            ? "bg-accent text-primary"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        )}
                      />
                    }
                  >
                    {link.label}
                  </SheetClose>
                ))}
              </nav>

              {isLoggedIn ? null : (
                <div className="mt-auto flex flex-col gap-2 border-t border-border/60 p-4">
                  <SheetClose
                    nativeButton={false}
                    render={
                      <Button
                        variant="outline"
                        className="w-full"
                        nativeButton={false}
                        render={<Link href="/login" />}
                      />
                    }
                  >
                    <LogIn className="size-4" />
                    Login
                  </SheetClose>
                  <SheetClose
                    nativeButton={false}
                    render={
                      <Button
                        className="w-full"
                        nativeButton={false}
                        render={<Link href="/register" />}
                      />
                    }
                  >
                    <UserPlus className="size-4" />
                    Register
                  </SheetClose>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function Navbar() {
  const pathname = usePathname();

  return <NavbarContent pathname={pathname} />;
}

/**
 * Static version for the prerendered shell. It shows the same header without
 * active-route highlighting until the live navbar streams in.
 */
export function NavbarFallback() {
  return <NavbarContent pathname={null} />;
}
