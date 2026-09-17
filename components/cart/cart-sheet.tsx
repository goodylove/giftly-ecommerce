"use client";
import Link from "next/link";
import { ShoppingBagIcon, XIcon } from "@phosphor-icons/react";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { EmptyCart } from "@/components/cart/empty-cart";
import { SheetBody, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatNaira } from "@/lib/gift-cards";
import { cn } from "@/lib/utils";

export function CartSheet() {
  const { items, count, subtotal } = useCart();

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle className="flex items-center gap-2">
          <ShoppingBagIcon size={18} />
          Cart ({count})
        </SheetTitle>
        <SheetClose render={<Button variant="ghost" size="icon-sm" aria-label="Close cart" />}>
          <XIcon />
        </SheetClose>
      </SheetHeader>

      <SheetBody>
        {items.length === 0 ? (
          <EmptyCart closesSheet />
        ) : (
          <ul className="flex flex-col gap-6">
            {items.map((item) => (
              <CartLineItem key={item.id} item={item} />
            ))}
          </ul>
        )}
      </SheetBody>

      {items.length > 0 && (
        <SheetFooter>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold">{formatNaira(subtotal)}</span>
          </div>
          {/* <p className="mt-1 text-xs text-muted-foreground">Delivery — sent by email, free.</p> */}
          <SheetClose
            render={<Link href="/checkout" className={cn(buttonVariants({ size: "lg" }), "mt-4 w-full")} />}
          >
            Checkout — {formatNaira(subtotal)}
          </SheetClose>
          <SheetClose
            render={
              <Link href="/#gift-cards" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-2 w-full")} />
            }
          >
            Continue shopping
          </SheetClose>
        </SheetFooter>
      )}
    </SheetContent>
  );
}
