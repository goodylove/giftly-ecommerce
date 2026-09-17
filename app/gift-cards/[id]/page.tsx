import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeftIcon } from "@phosphor-icons/react/ssr";
import { CardArtwork } from "@/components/gift-cards/card-artwork";
import { AddToCartButton } from "@/components/gift-cards/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { formatNaira, getGiftCard, giftCards } from "@/lib/gift-cards";

export function generateStaticParams() {
  return giftCards.map((card) => ({ id: card.id }));
}

export async function generateMetadata(props: PageProps<"/gift-cards/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const card = getGiftCard(id);
  if (!card) return {};
  return { title: `${card.name} — Giftly`, description: card.description };
}

export default async function GiftCardDetailPage(props: PageProps<"/gift-cards/[id]">) {
  const { id } = await props.params;
  const card = getGiftCard(id);
  if (!card) notFound();

  return (
    <section className="page-container detail-section">
      <Link href="/#gift-cards" className="detail-back">
        <ArrowLeftIcon size={16} /> Back to gift cards
      </Link>
      <div className="detail-grid">
        <CardArtwork card={card} className="detail-media" />
        <div>
          <div className="detail-eyebrow">
            <Badge variant="brand">{card.category}</Badge>
            <span>Digital gift card</span>
          </div>
          <h1 className="detail-title">{card.name}</h1>
          <p className="detail-description">{card.description}</p>
          <div className="detail-price-row">
            <span className="text-muted-foreground">Price</span>
            <span className="font-semibold">{formatNaira(card.startingPrice)}</span>
          </div>
          <AddToCartButton card={card} />
        </div>
      </div>
    </section>
  );
}
