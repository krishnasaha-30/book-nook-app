import { Suspense } from "react";
import { HeroSlider } from "@/components/home/hero-slider";
import { HowItWorks } from "@/components/home/how-it-works";
import {
  NewArrivals,
  NewArrivalsSkeleton,
} from "@/components/home/new-arrivals";
import { ReaderReviews } from "@/components/home/reader-reviews";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="mx-auto w-full max-w-7xl px-5 pt-8 sm:px-6 lg:pt-10">
        <HeroSlider />
      </section>

      <Suspense fallback={<NewArrivalsSkeleton />}>
        <NewArrivals />
      </Suspense>

      <HowItWorks />
      <ReaderReviews />
    </div>
  );
}
