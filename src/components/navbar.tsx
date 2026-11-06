"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Loader2,
  LogIn,
  LogOut,
  Menu,
  UserCircle,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { signOut } from "@/lib/auth-client";
import type { SessionUser } from "@/lib/session";
import { cn } from "@/lib/utils";

function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function initialsFor(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("") || "BN"
  );
}

export function NavbarContent({
  pathname,
  session,
}: {
  pathname: string | null;
  session: SessionUser | null;
}) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const user = session;
  const isLoggedIn = Boolean(user);

  const visibleLinks = navLinks.filter(
    (link) => !("private" in link) || !link.private || isLoggedIn,
  );

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      await signOut();
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  }

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

          {isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    aria-label="Open account menu"
                  />
                }
              >
                <Avatar>
                  <AvatarImage
                    src={user.image ?? undefined}
                    alt={`${user.name} profile`}
                  />
                  <AvatarFallback className="bg-primary/15 font-display font-semibold text-primary">
                    {initialsFor(user.name)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-2 py-1.5">
                    <span className="block truncate font-medium text-foreground">
                      {user.name}
                    </span>
                    <span className="block truncate font-normal text-muted-foreground">
                      {user.email}
                    </span>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  render={<Link href="/profile" />}
                  className="cursor-pointer gap-2 px-2 py-2"
                >
                  <UserCircle className="size-4" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => void handleSignOut()}
                  disabled={isSigningOut}
                  className="cursor-pointer gap-2 px-2 py-2 text-destructive focus:text-destructive"
                >
                  {isSigningOut ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <LogOut className="size-4" />
                  )}
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
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

              <div className="mt-auto flex flex-col gap-2 border-t border-border/60 p-4">
                {isLoggedIn && user ? (
                  <>
                    <div className="flex items-center gap-3 px-1 pb-2">
                      <Avatar>
                        <AvatarImage
                          src={user.image ?? undefined}
                          alt={`${user.name} profile`}
                        />
                        <AvatarFallback className="bg-primary/15 font-display font-semibold text-primary">
                          {initialsFor(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <SheetClose
                      nativeButton={false}
                      render={
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-2"
                          nativeButton={false}
                          render={<Link href="/profile" />}
                        />
                      }
                    >
                      <UserCircle className="size-4" />
                      My Profile
                    </SheetClose>
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                    >
                      {isSigningOut ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <LogOut className="size-4" />
                      )}
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

/**
 * Static version for the prerendered shell. It shows the same header without
 * active-route highlighting until the live navbar streams in.
 */
export function NavbarFallback() {
  return <NavbarContent pathname={null} session={null} />;
}

/**
 * Live navbar: resolves the current route on the client; the session comes
 * from the server via `<AppNavbar />` inside the layout's Suspense boundary.
 */
export function Navbar({ session }: { session: SessionUser | null }) {
  const pathname = usePathname();

  return <NavbarContent pathname={pathname} session={session} />;
}
