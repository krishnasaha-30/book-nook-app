"use client";

import { useActionState } from "react";
import { Loader2, Undo2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { returnBookAction } from "@/lib/actions";
import { initialActionState } from "@/lib/action-state";

export function ReturnBookButton({ borrowId }: { borrowId: string }) {
  const [state, formAction, isPending] = useActionState(
    returnBookAction,
    initialActionState,
  );

  return (
    <div className="space-y-2">
      <form action={formAction}>
        <input type="hidden" name="borrowId" value={borrowId} />
        <Button
          type="submit"
          variant="outline"
          size="sm"
          className="gap-1.5"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Undo2 className="size-4" />
          )}
          {isPending ? "Returning…" : "Return book"}
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
