import { ArrowRightIcon, ShieldCheckIcon } from "@phosphor-icons/react/ssr";
import { HeroCards } from "@/components/home/hero-cards";
import { buttonVariants } from "@/components/ui/button";
import { formatNaira, getGiftCard, giftCards } from "@/lib/gift-cards";

const lowestAmount = Math.min(...giftCards.map((card) => card.startingPrice));
const heroCards = ["spotify-premium", "nike", "amazon"]
  .map((id) => getGiftCard(id))
  .filter((card) => card !== undefined);

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="hero-section">
      <div className="page-container hero-grid">
        <div className="hero-copy">

          <h1 id="hero-heading" className="tracking-[-0.2px] leading-[1.1] text-5xl md:text-6xl lg:text-7xl">
            The gift they&apos;ll{" "}
            <span className="hero-mark">
              actually
              <svg viewBox="0 0 200 12" fill="none" preserveAspectRatio="none" aria-hidden="true">
                <path
                  d="M3 8.4C41 4.2 96 2.6 197 5.1"
                  stroke="currentColor"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            use.
          </h1>

          <p className="hero-description">
            Pick a brand they already love, choose an amount, and it lands in their inbox minutes
            later. No wrapping, no delivery window, no guessing their size.
          </p>

          <div className="hero-actions">
            <a href="#gift-cards" className={buttonVariants({ size: "lg" })}>
              Browse gift cards <ArrowRightIcon />
            </a>
          </div>


        </div>

        <HeroCards cards={heroCards} />
      </div>
    </section>
  );
}
