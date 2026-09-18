import { ArrowRightIcon, GiftIcon } from "@phosphor-icons/react/ssr";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export function CtaBand() {
  return (
    <section aria-labelledby="cta-heading" className="cta-section">
      <div className="page-container">
        <Reveal>
          <div className="cta-band">
            <span className="cta-icon" aria-hidden="true">
              <GiftIcon size={24} weight="duotone" />
            </span>
            <h2 id="cta-heading" className="cta-title">
              Someone&apos;s birthday is closer than you think.
            </h2>
            <p className="cta-body">
              Pick a card, choose an amount, and have it in their inbox before you finish your coffee.
            </p>
            <a href="#gift-cards" className={cn(buttonVariants({ size: "lg" }), "mt-7")}>
              Browse gift cards <ArrowRightIcon />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
