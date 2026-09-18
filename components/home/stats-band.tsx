import { Counter } from "@/components/ui/counter";
import { Reveal } from "@/components/ui/reveal";
import { categories, giftCards } from "@/lib/gift-cards";

// Every figure here is derived from the real catalogue rather than invented.
const brandCount = giftCards.length;
const categoryCount = categories.length - 1; // minus the "All cards" filter
const lowestAmount = Math.min(...giftCards.map((card) => card.startingPrice));

export function StatsBand() {
  return (
    <section aria-labelledby="stats-heading" className="stats-band">
      <h2 id="stats-heading" className="sr-only">
        Giftly at a glance
      </h2>
      <div className="page-container stats-grid">
        <Reveal className="stat">
          <p className="stat-value">
            <Counter value={brandCount} />
          </p>
          <p className="stat-label">Brands in the catalogue</p>
        </Reveal>
        <Reveal className="stat" delay={70}>
          <p className="stat-value">
            <Counter value={categoryCount} />
          </p>
          <p className="stat-label">Categories to browse</p>
        </Reveal>
        <Reveal className="stat" delay={140}>
          <p className="stat-value">
            <Counter value={lowestAmount} prefix="₦" />
          </p>
          <p className="stat-label">Gift cards start from</p>
        </Reveal>
        <Reveal className="stat" delay={210}>
          <p className="stat-value">24/7</p>
          <p className="stat-label">Order any time, delivered instantly</p>
        </Reveal>
      </div>
    </section>
  );
}
