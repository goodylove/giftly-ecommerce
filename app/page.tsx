import { GiftCardCollection } from "@/components/home/gift-card-collection";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <GiftCardCollection />
      <HowItWorks />
    </main>
  );
}
