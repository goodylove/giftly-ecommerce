"use client";
import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { getGiftCard, type GiftCardBrand } from "@/lib/gift-cards";

export interface CartItem {
  id: GiftCardBrand;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  // Flips to true once the mount effect below has read localStorage. Folded into
  // the same reducer state (rather than a separate useState) so the mount effect
  // only needs one dispatch call, not a dispatch *and* a setState call.
  hydrated: boolean;
}

type CartAction =
  | { type: "hydrate"; items: CartItem[] }
  | { type: "add"; id: GiftCardBrand; quantity: number }
  | { type: "setQuantity"; id: GiftCardBrand; quantity: number }
  | { type: "remove"; id: GiftCardBrand }
  | { type: "clear" };

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { items: action.items, hydrated: true };
    case "add": {
      const existing = state.items.find((item) => item.id === action.id);
      const items = existing
        ? state.items.map((item) =>
            item.id === action.id ? { ...item, quantity: item.quantity + action.quantity } : item,
          )
        : [...state.items, { id: action.id, quantity: action.quantity }];
      return { ...state, items };
    }
    case "setQuantity": {
      const items =
        action.quantity <= 0
          ? state.items.filter((item) => item.id !== action.id)
          : state.items.map((item) => (item.id === action.id ? { ...item, quantity: action.quantity } : item));
      return { ...state, items };
    }
    case "remove":
      return { ...state, items: state.items.filter((item) => item.id !== action.id) };
    case "clear":
      return { ...state, items: [] };
    default:
      return state;
  }
}

const STORAGE_KEY = "giftly:cart";

function readStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is CartItem => {
      return (
        !!item &&
        typeof item.id === "string" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        getGiftCard(item.id) !== undefined
      );
    });
  } catch {
    return [];
  }
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (id: GiftCardBrand, quantity?: number) => void;
  setQuantity: (id: GiftCardBrand, quantity: number) => void;
  remove: (id: GiftCardBrand) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [{ items, hydrated }, dispatch] = useReducer(reducer, { items: [], hydrated: false });

  // Read localStorage once on mount and fold the result into state via a single
  // dispatch — this is the "subscribe to an external system" case effects are
  // for, not a plain setState call, so it doesn't trigger cascading renders.
  useEffect(() => {
    dispatch({ type: "hydrate", items: readStoredCart() });
  }, []);

  // Mirror state back out to localStorage, but only once hydration has run —
  // otherwise this would fire first (on the initial, pre-hydration render) and
  // overwrite storage with the still-empty initial items.
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const count = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (getGiftCard(item.id)?.startingPrice ?? 0) * item.quantity, 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count,
      subtotal,
      add: (id, quantity = 1) => dispatch({ type: "add", id, quantity }),
      setQuantity: (id, quantity) => dispatch({ type: "setQuantity", id, quantity }),
      remove: (id) => dispatch({ type: "remove", id }),
      clear: () => dispatch({ type: "clear" }),
    }),
    [items, count, subtotal],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
