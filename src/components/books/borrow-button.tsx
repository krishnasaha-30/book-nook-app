"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, BookOpenCheck, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { borrowBookAction } from "@/lib/actions";
import { initialActionState } from "@/lib/action-state";
import { useSession } from "@/lib/auth-client";

export function BorrowButton({
  bookId,
  isAvailable,
}: {
  bookId: string;
  isAvailable: boolean;
}) {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();
  const [state, formAction, isPending] = useActionState(
    borrowBookAction,
    initialActionState,
  );

  useEffect(() => {
    if (state.message) {
      router.refresh();
    }
  }, [state.message, router]);

  if (!isAvailable) {
    return (
      <div>
        <Button size="lg" className="h-12 gap-2 px-7 text-sm" disabled>
          <BookOpenCheck className="size-4" />
          All copies are out
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          Check back soon — a copy will appear here as soon as another reader
          returns it.
        </p>
      </div>
    );
  }

  if (sessionPending) {
    return (
      <Button size="lg" className="h-12 gap-2 px-7 text-sm" disabled>
        <Loader2 className="size-4 animate-spin" />
        Checking your account…
      </Button>
    );
  }

  if (!session?.user) {
    return (
      <div>
        <Button
          size="lg"
          className="h-12 gap-2 px-7 text-sm"
          nativeButton={false}
          render={<Link href={`/login?redirect=/books/${bookId}`} />}
        >
          <BookOpenCheck className="size-4" />
          Borrow this book
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          Sign in to borrow. The book returns to the shelf automatically after
          seven days.
        </p>
      </div>
    );
  }

  return (
    <div>
      <form action={formAction}>
        <input type="hidden" name="bookId" value={bookId} />
        <Button
          type="submit"
          size="lg"
          className="h-12 gap-2 px-7 text-sm"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <BookOpenCheck className="size-4" />
          )}
          {isPending ? "Borrowing…" : "Borrow this book"}
        </Button>
      </form>

      <p className="mt-3 text-xs text-muted-foreground">
        Seven-day loan, no late fees. Return it from “My borrows” whenever you
        are done.
      </p>

      {state.error ? (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}

      {state.message ? (
        <Alert className="mt-4 border-primary/30 bg-primary/10">
          <CheckCircle2 className="text-primary" />
          <AlertDescription className="text-foreground">
            {state.message}
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
