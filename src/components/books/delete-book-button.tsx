"use client";

import { useActionState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { deleteBookAction } from "@/lib/actions";
import { initialActionState } from "@/lib/action-state";

export function DeleteBookButton({
  bookId,
  title,
}: {
  bookId: string;
  title: string;
}) {
  const [state, formAction, isPending] = useActionState(
    deleteBookAction,
    initialActionState,
  );

  return (
    <div className="space-y-2">
      <form
        action={formAction}
        onSubmit={(event) => {
          const confirmed = window.confirm(
            `Remove “${title}” from the shelf? This cannot be undone.`,
          );

          if (!confirmed) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="bookId" value={bookId} />
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          className="gap-1.5 px-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Trash2 className="size-4" />
          )}
          {isPending ? "Removing…" : "Remove"}
        </Button>
      </form>

      {state.error ? (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}

      {state.message ? (
        <p className="text-xs text-primary">{state.message}</p>
      ) : null}
    </div>
  );
}
