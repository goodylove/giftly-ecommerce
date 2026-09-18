"use client";
import Link from "next/link";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { EmptyCart } from "@/components/cart/empty-cart";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { formatNaira } from "@/lib/gift-cards";
import { cn } from "@/lib/utils";
import { useCart } from "../context/cartProvider";

export default function CartPage() {
  const { items, subtotal } = useCart();

  return (
    <section className="page-container py-10 md:py-14">
      <h1 className="section-heading">Your cart</h1>

      {items.length === 0 ? (
        <div className="mx-auto mt-10 max-w-md">
          <EmptyCart />
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
          <ul className="flex flex-col gap-6">
            {items.map((item) => (
              <CartLineItem key={item.id} item={item} />
            ))}
          </ul>

          <div className="h-fit rounded-2xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold">Order summary</h2>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatNaira(subtotal)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Delivery</span>
              <span className="font-medium">Sent by email — free</span>
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatNaira(subtotal)}</span>
            </div>
            <Link href="/checkout" className={cn(buttonVariants({ size: "lg" }), "mt-6 w-full")}>
              Proceed to checkout
            </Link>
            <Link
              href="/#gift-cards"
              className="mt-3 block text-center text-sm text-muted-foreground hover:text-foreground"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
