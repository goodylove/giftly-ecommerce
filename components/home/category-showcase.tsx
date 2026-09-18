import {
  ArrowRightIcon,
  GameControllerIcon,
  MusicNotesIcon,
  ShoppingBagIcon,
  TShirtIcon,
} from "@phosphor-icons/react/ssr";
import { CardArtwork } from "@/components/gift-cards/card-artwork";
import { CategoryTileLink } from "@/components/home/category-tile-link";
import { Reveal } from "@/components/ui/reveal";
import { giftCards, type GiftCardCategory } from "@/lib/gift-cards";

const CATEGORY_META: {
  name: GiftCardCategory;
  icon: typeof ShoppingBagIcon;
  blurb: string;
}[] = [
  {
    name: "Shopping",
    icon: ShoppingBagIcon,
    blurb: "Everyday essentials and the occasional big-ticket treat.",
  },
  {
    name: "Gaming",
    icon: GameControllerIcon,
    blurb: "Credit for the next release, season pass or add-on.",
  },
  {
    name: "Entertainment",
    icon: MusicNotesIcon,
    blurb: "Music, films and apps they already open every day.",
  },
  {
    name: "Fashion",
    icon: TShirtIcon,
    blurb: "Sneakers, staples and the thing sitting in their wishlist.",
  },
];

export function CategoryShowcase() {
  return (
    <section aria-labelledby="categories-heading" className="category-section">
      <div className="page-container">
        <Reveal>
          <h2 id="categories-heading" className="section-heading">
            Shop by category
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Not sure where to start? Pick the kind of thing they&apos;d spend it on.
          </p>
        </Reveal>

        <div className="category-grid">
          {CATEGORY_META.map((category, index) => {
            const cards = giftCards.filter((card) => card.category === category.name);
            const Icon = category.icon;

            return (
              <Reveal key={category.name} delay={index * 70}>
                <CategoryTileLink category={category.name}>
                  <span className="category-tile-stack" aria-hidden="true">
                    {cards.slice(0, 3).map((card) => (
                      <CardArtwork key={card.id} card={card} compact />
                    ))}
                  </span>
                  <span className="category-tile-body">
                    <span className="category-tile-top">
                      <span className="how-icon">
                        <Icon size={20} />
                      </span>
                      <span className="category-tile-count">
                        {cards.length} {cards.length === 1 ? "card" : "cards"}
                      </span>
                    </span>
                    <span className="category-tile-name">{category.name}</span>
                    <span className="category-tile-blurb">{category.blurb}</span>
                    <span className="category-tile-link">
                      Browse {category.name.toLowerCase()}
                      <ArrowRightIcon size={14} />
                    </span>
                  </span>
                </CategoryTileLink>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
