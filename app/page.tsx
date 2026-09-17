import { BrandStrip } from "@/components/home/brand-strip";
import { GiftCardCollection } from "@/components/home/gift-card-collection";
import { Hero } from "@/components/home/hero";

export default function Home() {
  return (
    <>
      <Hero />
      <BrandStrip />
      <GiftCardCollection />
    </>
  );
}
