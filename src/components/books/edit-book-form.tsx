"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AlertCircle, Loader2, Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookImageField } from "@/components/books/book-image-field";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { updateBookAction } from "@/lib/actions";
import { initialActionState } from "@/lib/action-state";
import { BOOK_CATEGORIES } from "@/lib/books";
import type { Book } from "@/types/book";

export function EditBookForm({ book }: { book: Book }) {
  const [state, formAction, isPending] = useActionState(
    updateBookAction.bind(null, book._id),
    initialActionState,
  );
  return (
    <form action={formAction} className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Book title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={book.title}
              required
              maxLength={200}
              className="h-11"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                name="author"
                defaultValue={book.author}
                required
                maxLength={120}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <NativeSelect
                id="category"
                name="category"
                defaultValue={book.category}
                required
                className="h-11 w-full [&_select]:h-11"
              >
                {BOOK_CATEGORIES.map((category) => (
                  <NativeSelectOption key={category} value={category}>
                    {category}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalCopies">Copies on your shelf</Label>
            <Input
              id="totalCopies"
              name="totalCopies"
              type="number"
              min={1}
              max={999}
              step={1}
              defaultValue={book.totalCopies}
              required
              className="h-11 sm:max-w-40"
            />
            <p className="text-xs text-muted-foreground">
              {book.totalCopies - book.availableCopies} copies are currently
              borrowed, so you cannot go below that number.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={book.description}
              required
              maxLength={2000}
              rows={6}
            />
          </div>
        </div>

        <aside>
          <BookImageField
            initialUrl={book.imageUrl}
            imageAlt={`Cover of ${book.title}`}
          />
        </aside>
      </div>

      {state.error ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 border-t border-border/60 pt-6">
        <Button
          type="submit"
          size="lg"
          className="h-11 gap-2 px-6"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {isPending ? "Saving…" : "Save changes"}
        </Button>

        <Button
          variant="ghost"
          nativeButton={false}
          render={<Link href="/my-books" />}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
