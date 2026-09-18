"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AddToCartButton } from "@/components/gift-cards/add-to-cart-button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatNaira, type GiftCard } from "@/lib/gift-cards";
import { cn } from "@/lib/utils";

export function DenominationPicker({ card }: { card: GiftCard }) {
  const [denomination, setDenomination] = useState<number>(card.startingPrice);

  return (
    <div>
      <div className="detail-price-row">
        <span className="text-muted-foreground">Price</span>
        <span className="relative overflow-hidden font-semibold" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={denomination}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              {formatNaira(denomination)}
            </motion.span>
          </AnimatePresence>
        </span>
      </div>

      <fieldset className="mt-6">
        <legend className="mb-3 text-sm font-semibold">Choose an amount</legend>
        <RadioGroup
          value={String(denomination)}
          onValueChange={(value) => setDenomination(Number(value))}
          aria-label={`${card.name} amount`}
          className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {card.denominations.map((amount) => (
            <label
              key={amount}
              className={cn(
                "flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border border-border p-3 text-center text-sm transition-colors",
                denomination === amount && "border-primary bg-primary/5",
              )}
            >
              <RadioGroupItem value={String(amount)} />
              <span className="font-medium">{formatNaira(amount)}</span>
              {amount === card.startingPrice && (
                <span className="text-xs text-muted-foreground">Most popular</span>
              )}
            </label>
          ))}
        </RadioGroup>
      </fieldset>

      <AddToCartButton card={card} denomination={denomination} className="mt-6" />
    </div>
  );
}
