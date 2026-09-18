import {
  ArrowRightIcon,
  ClockCounterClockwiseIcon,
  EnvelopeSimpleIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react/ssr";
import { buttonVariants } from "@/components/ui/button";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="hero-section">
      <div className="page-container hero-content">
        <p className="hero-label">Gift cards for every day.</p>
        <h1 id="hero-heading">The easiest way<br className="hidden sm:block" /> to send a gift.</h1>
        <p className="hero-description">Shop digital gift cards from brands they love.<br className="hidden sm:block" /> Choose a card. Pick an amount. Make it theirs.</p>
        <a href="#gift-cards" className={buttonVariants({ size: "lg" })}>Explore gift cards <ArrowRightIcon /></a>
        <p className="hero-benefits">
          <span><EnvelopeSimpleIcon size={15} aria-hidden="true" /> Delivered by email in minutes</span>
          <span><ShieldCheckIcon size={15} aria-hidden="true" /> Secured by Paystack</span>
          <span><ClockCounterClockwiseIcon size={15} aria-hidden="true" /> Codes never expire</span>
        </p>
      </div>
    </section>
  );
}
