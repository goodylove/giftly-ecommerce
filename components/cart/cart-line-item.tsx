"use client";
import { MinusIcon, PlusIcon, XIcon } from "@phosphor-icons/react";
import { CardArtwork } from "@/components/gift-cards/card-artwork";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart, type CartItem } from "@/lib/cart";
import { formatNaira, getGiftCard } from "@/lib/gift-cards";

export function CartLineItem({ item, compact }: { item: CartItem; compact?: boolean }) {
  const { setQuantity, remove } = useCart();
  const card = getGiftCard(item.id);
  if (!card) return null;

  const lineTotal = formatNaira(card.startingPrice * item.quantity);

  return (
    <li className="flex items-start gap-3 p-2">
      <CardArtwork card={card} compact className="aspect-square w-14 shrink-0 rounded-lg" />

      <div className="min-w-0 flex-1">
        {/* Row 1: identity + remove — its own row so a category badge never fights the price/stepper for space. */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{card.name}</p>
            {!compact && (
              <Badge variant="outline" className="mt-1">
                {card.category}
              </Badge>
            )}
          </div>
          {!compact && (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="shrink-0"
              aria-label={`Remove ${card.name} from cart`}
              onClick={() => remove(item.id)}
            >
              <XIcon />
            </Button>
          )}
        </div>

        {/* Row 2: unit price on the left, quantity + line total on the right. */}
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">{formatNaira(card.startingPrice)} each</span>
          {compact ? (
            <span className="text-sm font-semibold">
              ×{item.quantity} · {lineTotal}
            </span>
          ) : (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-xs"
                  aria-label={`Decrease quantity of ${card.name}`}
                  onClick={() => setQuantity(item.id, item.quantity - 1)}
                >
                  <MinusIcon />
                </Button>
                <span className="w-5 text-center text-sm tabular-nums">{item.quantity}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-xs"
                  aria-label={`Increase quantity of ${card.name}`}
                  onClick={() => setQuantity(item.id, item.quantity + 1)}
                >
                  <PlusIcon />
                </Button>
              </span>
              <span className="text-sm font-semibold">{lineTotal}</span>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
