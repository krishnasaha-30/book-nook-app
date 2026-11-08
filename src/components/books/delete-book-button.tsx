"use client";

import { useActionState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

  const formId = `remove-book-${bookId}`;

  return (
    <div className="space-y-2">
      <form id={formId} action={formAction}>
        <input type="hidden" name="bookId" value={bookId} />
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1.5 px-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                disabled={isPending}
              />
            }
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            {isPending ? "Removing…" : "Remove"}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-destructive">
                Warning:
              </AlertDialogTitle>
              <AlertDialogDescription className="text-destructive">
                Are you sure you want to remove &quot;{title}&quot; from the
                shelf? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                form={formId}
                variant="destructive"
                disabled={isPending}
              >
                Remove book
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>

      {state.error ? (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}

    </div>
  );
}
