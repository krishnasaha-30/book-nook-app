import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/auth/profile-form";
import { PageHeader } from "@/components/page-header";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "My profile",
  description: "View and update your BookNook profile.",
};

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/profile");
  }

  return (
    <>
      <PageHeader
        eyebrow="Your account"
        title="Your reader profile."
        description="Keep your name and profile photo up to date for the BookNook community."
      />
      <section className="mx-auto w-full max-w-3xl px-5 pb-24 sm:px-6">
        <ProfileForm user={user} />
      </section>
    </>
  );
}
