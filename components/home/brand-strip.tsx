import { giftCards } from "@/lib/gift-cards";

export function BrandStrip() {
  return (
    <div className="border-b border-border bg-card">
      <div className="page-container flex flex-col items-center gap-4 py-6 sm:flex-row sm:justify-between">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Redeemable at</p>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {giftCards.map((card) => (
            <li
              key={card.id}
              className="text-sm font-semibold tracking-tight text-muted-foreground/70 transition-colors hover:text-foreground"
            >
              {card.brand}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
