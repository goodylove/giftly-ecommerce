"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRightIcon, MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { AddToCartButton } from "@/components/gift-cards/add-to-cart-button";
import { CardArtwork } from "@/components/gift-cards/card-artwork";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  categories,
  formatNaira,
  giftCards,
  type CategoryFilter,
  type GiftCard,
} from "@/lib/gift-cards";
import { cn } from "@/lib/utils";

function GiftCardItem({ card }: { card: GiftCard }) {
  return (
    <article className="catalogue-card-wrap">
      <Link href={`/gift-cards/${card.id}`} className="catalogue-card group" aria-label={`View ${card.name}`}>
        <span className="catalogue-card-image">
          <CardArtwork card={card} />
          <span className="catalogue-card-arrow" aria-hidden="true">
            <ArrowUpRightIcon size={18} />
          </span>
        </span>
        <span className="catalogue-card-info">
          <span className="catalogue-card-name">{card.name}</span>
          <span className="catalogue-card-price">
            From {formatNaira(card.startingPrice)}
          </span>
        </span>
      </Link>
      <AddToCartButton card={card} compact className="catalogue-card-add" />
    </article>
  );
}

export function GiftCardCollection() {
  const [category, setCategory] = useState<CategoryFilter>("All cards");
  const [query, setQuery] = useState("");
  const search = query.trim().toLocaleLowerCase("en");
  const visibleCards = giftCards.filter(
    (card) =>
      (category === "All cards" || card.category === category) &&
      card.name.toLocaleLowerCase("en").includes(search),
  );
  function resetFilters() {
    setCategory("All cards");
    setQuery("");
  }

  return (
    <section
      id="gift-cards"
      aria-labelledby="collection-heading"
      className="page-container catalogue-section scroll-mt-8"
    >
      <div className="catalogue-heading">
        <div>
          <h2 id="collection-heading" className="section-heading">
            Popular gift cards
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            For their next game, favourite playlist, or something on their wish
            list.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <label htmlFor="gift-card-search" className="sr-only">
            Search gift cards
          </label>
          <MagnifyingGlassIcon
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="gift-card-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search gift cards"
            className="pr-11 pl-10 [&::-webkit-search-cancel-button]:appearance-none"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute top-0.5 right-0.5"
              aria-label="Clear search"
              onClick={() => setQuery("")}
            >
              <XIcon />
            </Button>
          )}
        </div>
      </div>
      <div className="catalogue-toolbar">
        <div
          className="catalogue-filters"
          role="group"
          aria-label="Filter gift cards by category"
        >
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              className={cn(
                "category-tab",
                category === item && "category-tab--active",
              )}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
          {visibleCards.length} cards
        </span>
      </div>
      <p className="sr-only" role="status">
        {visibleCards.length} gift{" "}
        {visibleCards.length === 1 ? "card" : "cards"} found
      </p>
      {visibleCards.length ? (
        <div className="catalogue-grid">
          {visibleCards.map((card) => (
            <GiftCardItem key={card.id} card={card} />
          ))}
        </div>
      ) : (
        <div className="catalogue-empty">
          <MagnifyingGlassIcon
            size={28}
            className="mx-auto mb-4 text-muted-foreground"
          />
          <h3 className="text-lg font-medium">No gift cards found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try another brand or choose a different category.
          </p>
          <Button variant="outline" className="mt-5" onClick={resetFilters}>
            Show all gift cards
          </Button>
        </div>
      )}
    </section>
  );
}
