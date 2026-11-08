"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";

export function BookRemovedToast() {
  const router = useRouter();

  useEffect(() => {
    toast.add({
      title: "Book removed",
      description: "The book was removed from your shelf.",
      type: "success",
    });
    router.replace("/my-books", { scroll: false });
  }, [router]);

  return null;
}
