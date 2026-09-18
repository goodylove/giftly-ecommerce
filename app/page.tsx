import { BrandStrip } from "@/components/home/brand-strip";
import { CategoryFilterProvider } from "@/components/home/category-filter-context";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { CtaBand } from "@/components/home/cta-band";
import { Faq } from "@/components/home/faq";
import { GiftCardCollection } from "@/components/home/gift-card-collection";
import { Hero } from "@/components/home/hero";
import { StatsBand } from "@/components/home/stats-band";
import { Testimonials } from "@/components/home/testimonials";
import { WhyGiftly } from "@/components/home/why-giftly";

export default function Home() {
  return (
    <>
      <Hero />
      <BrandStrip />
      <CategoryFilterProvider>
        <CategoryShowcase />
        <GiftCardCollection />
      </CategoryFilterProvider>
      <WhyGiftly />
      <StatsBand />
      <Testimonials />
      <Faq />
      <CtaBand />
    </>
  );
}
