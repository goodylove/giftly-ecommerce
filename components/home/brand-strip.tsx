import { giftCards } from "@/lib/gift-cards";

export function BrandStrip() {
  return (
    <div className="border-b border-border bg-card">
      {/* Announced once for screen readers; the scrolling marquee below is decorative. */}
      <p className="sr-only">
        Redeemable at {giftCards.map((card) => card.brand).join(", ")}
      </p>
      <div className="brand-marquee page-container py-6" aria-hidden="true">
        <div className="brand-marquee-track">
          {[...giftCards, ...giftCards].map((card, index) => (
            <span key={`${card.id}-${index}`} className="brand-mark">
              {card.brand}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
