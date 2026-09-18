"use client";
import { CheckIcon, ShoppingBagIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

import type { GiftCard } from "@/lib/gift-cards";
import { useCart } from "@/app/context/cartProvider";

export function AddToCartButton({ card, className }: { card: GiftCard; className?: string }) {
  const { add, items } = useCart();
  // Derived straight from live cart state (not a "just clicked" timer) — the button
  // stays "Added to cart" for as long as it actually is, and updates immediately on
  // every click, instead of flashing a confirmation that reverts while the item is
  // still sitting in the cart.
  const quantity = items.find((item) => item.id === card.id)?.quantity ?? 0;
  const label = quantity === 0 ? "Add to cart" : quantity === 1 ? "Added to cart" : `${quantity} in cart`;

  return (
    <Button type="button" size="lg" className={className} onClick={() => add(card.id)}>
      {quantity === 0 ? <ShoppingBagIcon /> : <CheckIcon weight="bold" />}
      {label}
    </Button>
  );
}
