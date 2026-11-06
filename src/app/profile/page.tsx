import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/auth/profile-form";
import { PageHeader } from "@/components/page-header";
import { Spinner } from "@/components/ui/spinner";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "My profile",
  description: "View and update your BookNook profile.",
};

async function ProfileContent() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/profile");
  }

  return <ProfileForm user={user} />;
}

export default function ProfilePage() {
  return (
    <>
      <PageHeader
        eyebrow="Your account"
        title="Your reader profile."
        description="Keep your name and profile photo up to date for the BookNook community."
      />
      <section className="mx-auto w-full max-w-3xl px-5 pb-24 sm:px-6">
        <Suspense
          fallback={
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Spinner className="size-5 text-primary" />
              Loading your profile…
            </div>
          }
        >
          <ProfileContent />
        </Suspense>
      </section>
    </>
  );
}
