"use client";

import { CartItem, readStoredCart, reducer, STORAGE_KEY } from "@/lib/cart";
import { GiftCardBrand } from "@/lib/gift-cards";
import { createContext, ReactNode, useContext, useEffect, useMemo, useReducer } from "react";


interface CartContextValue {
    items: CartItem[];
    count: number;
    subtotal: number;
    add: (id: GiftCardBrand, denomination: number, quantity?: number) => void;
    setQuantity: (id: GiftCardBrand, denomination: number, quantity: number) => void;
    remove: (id: GiftCardBrand, denomination: number) => void;
    clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [{ items, hydrated }, dispatch] = useReducer(reducer, { items: [], hydrated: false });

    // Read localStorage once on mount and fold the result into state via a single
    // dispatch this is the "subscribe to an external system" case effects are
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
        () => items.reduce((sum, item) => sum + item.denomination * item.quantity, 0),
        [items],
    );

    const value = useMemo<CartContextValue>(
        () => ({
            items,
            count,
            subtotal,
            add: (id, denomination, quantity = 1) => dispatch({ type: "add", id, denomination, quantity }),
            setQuantity: (id, denomination, quantity) => dispatch({ type: "setQuantity", id, denomination, quantity }),
            remove: (id, denomination) => dispatch({ type: "remove", id, denomination }),
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
