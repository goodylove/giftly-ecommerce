"use client";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { CategoryFilter } from "@/lib/gift-cards";

interface CategoryFilterValue {
  category: CategoryFilter;
  setCategory: (category: CategoryFilter) => void;
}

const CategoryFilterContext = createContext<CategoryFilterValue | null>(null);

// Shared so the "Shop by category" tiles and the catalogue's filter tabs stay in sync.
export function CategoryFilterProvider({ children }: { children: ReactNode }) {
  const [category, setCategory] = useState<CategoryFilter>("All cards");
  const value = useMemo(() => ({ category, setCategory }), [category]);

  return <CategoryFilterContext.Provider value={value}>{children}</CategoryFilterContext.Provider>;
}

export function useCategoryFilter() {
  const context = useContext(CategoryFilterContext);
  if (!context) throw new Error("useCategoryFilter must be used within a CategoryFilterProvider");
  return context;
}
