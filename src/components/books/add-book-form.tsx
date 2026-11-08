"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { AlertCircle, BookPlus, Loader2 } from "lucide-react";
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
import { createBookAction } from "@/lib/actions";
import { initialActionState } from "@/lib/action-state";
import { getBookCategories, MAX_BOOK_CATEGORY_LENGTH } from "@/lib/books";

const ADD_NEW_CATEGORY = "__add_new_category__";

export function AddBookForm({ categories }: { categories: string[] }) {
  const [state, formAction, isPending] = useActionState(
    createBookAction,
    initialActionState,
  );
  const [selectedCategory, setSelectedCategory] = useState("Fiction");
  const categoryOptions = getBookCategories(categories);

  return (
    <form action={formAction} className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Book title</Label>
            <Input
              id="title"
              name="title"
              placeholder="The Night Circus"
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
                placeholder="Erin Morgenstern"
                required
                maxLength={120}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <NativeSelect
                id="category"
                name={
                  selectedCategory === ADD_NEW_CATEGORY
                    ? undefined
                    : "category"
                }
                value={selectedCategory}
                onChange={(event) =>
                  setSelectedCategory(event.currentTarget.value)
                }
                required
                className="h-11 w-full [&_select]:h-11"
              >
                {categoryOptions.map((category) => (
                  <NativeSelectOption key={category} value={category}>
                    {category}
                  </NativeSelectOption>
                ))}
                <NativeSelectOption value={ADD_NEW_CATEGORY}>
                  Add a new category…
                </NativeSelectOption>
              </NativeSelect>
              {selectedCategory === ADD_NEW_CATEGORY ? (
                <Input
                  id="new-category"
                  name="category"
                  required
                  maxLength={MAX_BOOK_CATEGORY_LENGTH}
                  placeholder="Enter a new category"
                  className="mt-2 h-11"
                  autoFocus
                />
              ) : null}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="totalCopies">Copies on your shelf</Label>
              <Input
                id="totalCopies"
                name="totalCopies"
                type="number"
                min={1}
                max={999}
                step={1}
                defaultValue={1}
                required
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="What is this book about, and why should another reader pick it up?"
              required
              maxLength={2000}
              rows={6}
            />
            <p className="text-xs text-muted-foreground">
              Up to 2,000 characters. A few honest sentences are perfect.
            </p>
          </div>
        </div>

        <aside>
          <BookImageField />
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
            <BookPlus className="size-4" />
          )}
          {isPending ? "Adding to the shelf…" : "Add this book"}
        </Button>

        <Button
          variant="ghost"
          nativeButton={false}
          render={<Link href="/books" />}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
