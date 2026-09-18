"use client";
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

export function reducer(state: CartState, action: CartAction): CartState {
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

export const STORAGE_KEY = "giftly:cart";

export function readStoredCart(): CartItem[] {
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

