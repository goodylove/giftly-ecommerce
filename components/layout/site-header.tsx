"use client";
import Link from "next/link";
import { ShoppingBagIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { CartSheet } from "@/components/cart/cart-sheet";
import { useCart } from "@/app/context/cartProvider";

export function SiteHeader() {
  const { count } = useCart();

  return (
    <header className="border-b border-border bg-background">
      <div className="page-container flex h-22 items-center justify-between gap-4">
        <Link href="/" aria-label="Giftly home" className="wordmark">
          giftly<span className="text-brand">.</span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="flex items-center gap-5 sm:gap-9"
        >
          <Link href="/#gift-cards" className="nav-link">
            Browse<span className="hidden sm:inline"> gift cards</span>
          </Link>

          <span
            className="hidden h-5 w-px bg-border sm:block"
            aria-hidden="true"
          />
          <Sheet>
            <SheetTrigger
              render={<Button variant="ghost" className="px-3" />}
              aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
            >
              <ShoppingBagIcon />
              <span className="hidden sm:inline">Cart</span>
              <span className="flex size-5 items-center justify-center rounded-full bg-foreground text-[10px] text-white">
                {count}
              </span>
            </SheetTrigger>
            <CartSheet />
          </Sheet>
        </nav>
      </div>
    </header>
  );
}
