import { ArrowRightIcon, EnvelopeSimpleIcon, ShieldCheckIcon } from "@phosphor-icons/react/ssr";
import { buttonVariants } from "@/components/ui/button";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="hero-section">
      <div className="page-container hero-content">
        <p className="hero-label">Gift cards for every day.</p>
        <h1 id="hero-heading">The easiest way<br className="hidden sm:block" /> to send a gift.</h1>
        <p className="hero-description">Shop digital gift cards from brands they love.<br className="hidden sm:block" /> Choose a card. Pick an amount. Make it theirs.</p>
        <a href="#gift-cards" className={buttonVariants({ size: "lg" })}>Explore gift cards <ArrowRightIcon /></a>
        <div className="hero-benefits">
          <span><EnvelopeSimpleIcon size={16} />Delivered by email</span>
          <span><ShieldCheckIcon size={16} />Secure payment</span>
        </div>
      </div>
    </section>
  );
}
