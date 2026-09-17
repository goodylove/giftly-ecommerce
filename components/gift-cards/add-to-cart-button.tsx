"use client";
import { useState } from "react";
import { CheckIcon, PlusIcon, ShoppingBagIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import type { GiftCard } from "@/lib/gift-cards";

export function AddToCartButton({
  card,
  compact,
  className,
}: {
  card: GiftCard;
  compact?: boolean;
  className?: string;
}) {
  const { add } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleClick() {
    add(card.id);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1300);
  }

  if (compact) {
    return (
      <Button
        type="button"
        variant="secondary"
        size="icon-sm"
        shape="pill"
        className={className}
        aria-label={justAdded ? `Added ${card.name} to cart` : `Add ${card.name} to cart`}
        onClick={handleClick}
      >
        {justAdded ? <CheckIcon weight="bold" /> : <PlusIcon />}
      </Button>
    );
  }

  return (
    <Button type="button" size="lg" className={className} onClick={handleClick}>
      {justAdded ? <CheckIcon weight="bold" /> : <ShoppingBagIcon />}
      {justAdded ? "Added" : "Add to cart"}
    </Button>
  );
}
