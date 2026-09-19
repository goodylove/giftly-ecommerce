"use client";
import type { ReactNode } from "react";
import { useCategoryFilter } from "@/context/category-filter-context";
import type { GiftCardCategory } from "@/lib/gift-cards";
import Link from "next/link";

// Stays a plain anchor so the jump to the catalogue still works without JS —
// the click handler only adds the filter selection on top of that.
export function CategoryTileLink({
  category,
  children,
}: {
  category: GiftCardCategory;
  children: ReactNode;
}) {
  const { setCategory } = useCategoryFilter();

  return (
    <Link href="#gift-cards" className="category-tile" onClick={() => setCategory(category)}>
      {children}
    </Link>
  );
}
