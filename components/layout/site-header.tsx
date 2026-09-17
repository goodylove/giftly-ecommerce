"use client";
import Link from "next/link";
import {
  ArrowRightIcon,
  GiftIcon,
  ShoppingBagIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function SiteHeader() {
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
          <a href="#gift-cards" className="nav-link">
            Browse<span className="hidden sm:inline"> gift cards</span>
          </a>
          <a
            href="#how-it-works"
            className="nav-link hidden min-[420px]:inline"
          >
            How it works
          </a>
          <span
            className="hidden h-5 w-px bg-border sm:block"
            aria-hidden="true"
          />
          <Dialog>
            <DialogTrigger
              render={<Button variant="ghost" className="px-3" />}
              aria-label="Open cart, 0 items"
            >
              <ShoppingBagIcon />
              <span className="hidden sm:inline">Cart</span>
              <span className="flex size-5 items-center justify-center rounded-full bg-foreground text-[10px] text-white">
                0
              </span>
            </DialogTrigger>
            <DialogContent className="py-10 text-center">
              <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <GiftIcon size={28} weight="duotone" />
              </div>
              <DialogTitle>A little happiness goes here.</DialogTitle>
              <DialogDescription>
                Your cart is empty. Explore the collection and find a gift that
                feels just right.
              </DialogDescription>
              <DialogClose
                render={<Button className="mt-6 w-full" />}
                onClick={() =>
                  document
                    .getElementById("gift-cards")
                    ?.scrollIntoView({ block: "start" })
                }
              >
                Explore gift cards <ArrowRightIcon />
              </DialogClose>
            </DialogContent>
          </Dialog>
        </nav>
      </div>
    </header>
  );
}
