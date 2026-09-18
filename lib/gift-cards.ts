export type GiftCardBrand =
  | "amazon"
  | "apple"
  | "playstation"
  | "nike"
  | "spotify-premium"
  | "steam"
  | "walmart"
  | "uber";
export type GiftCardCategory =
  | "Shopping"
  | "Gaming"
  | "Entertainment"
  | "Fashion";

export interface GiftCard {
  id: GiftCardBrand;
  brand: string;
  name: string;
  category: GiftCardCategory;
  description: string;
  startingPrice: number;
  imageSrc?: string;
  denominations: readonly number[];
}

// Selected names, descriptions, categories, and artwork adapted from the user's
// ecommerce/lib/constants.ts catalogue. NGN prices are Giftly demo amounts,
// not conversions of the source catalogue's USD denominations.

export const giftCards: readonly GiftCard[] = [
  {
    id: "amazon",
    brand: "Amazon",
    name: "Amazon Gift Card",
    category: "Shopping",
    description:
      "The gift that always fits — let them shop books, electronics, and everyday essentials on Amazon.",
    startingPrice: 5000,
    denominations: [5000, 10000, 20000, 50000],
  },

  {
    id: "apple",
    brand: "Apple",
    name: "Apple Gift Card",
    category: "Entertainment",
    description:
      "Apps, games, music, and more — one card for everything they love across the Apple ecosystem.",
    startingPrice: 10000,
    denominations: [10000, 20000, 50000],
    imageSrc: "/gift-cards/apple.svg",
  },

  {
    id: "playstation",
    brand: "PlayStation",
    name: "PlayStation Gift Card",
    category: "Gaming",
    description:
      "Fuel their next gaming session with new titles, add-ons, and subscriptions from the PlayStation Store.",
    startingPrice: 15000,
    denominations: [15000, 25000, 50000],
    imageSrc: "/gift-cards/playstation.svg",
  },

  {
    id: "nike",
    brand: "Nike",
    name: "Nike Gift Card",
    category: "Fashion",
    description:
      "Fresh sneakers, apparel, and gear — perfect for the sneakerhead in their life.",
    startingPrice: 20000,
    denominations: [20000, 30000, 50000],
    imageSrc: "/gift-cards/nike.svg",
  },

  {
    id: "spotify-premium",
    brand: "Spotify",
    name: "Spotify Premium Gift Card",
    category: "Entertainment",
    description:
      "Ad-free music, offline downloads, and their favourite playlists on repeat — the soundtrack to their year.",
    startingPrice: 3000,
    denominations: [3000, 5000, 10000],
    imageSrc: "/gift-cards/spotify-premium.svg",
  },

  {
    id: "steam",
    brand: "Steam",
    name: "Steam Gift Card",
    category: "Gaming",
    description:
      "New releases, indie favourites, and downloadable content — a great gift for any PC gamer.",
    startingPrice: 7500,
    denominations: [7500, 15000, 30000],
  },

  {
    id: "walmart",
    brand: "Walmart",
    name: "Walmart Gift Card",
    category: "Shopping",
    description:
      "One gift card for all of life's essentials — groceries, electronics, clothing, and more at Walmart.",
    startingPrice: 5000,
    denominations: [5000, 10000, 25000, 50000],
    imageSrc: "/gift-cards/walmart.svg",
  },

  {
    id: "uber",
    brand: "Uber",
    name: "Uber Gift Card",
    category: "Shopping",
    description:
      "Give them a ride across town or dinner delivered — the gift of getting where and what they need.",
    startingPrice: 4000,
    denominations: [4000, 8000, 15000],
    imageSrc: "/gift-cards/uber.svg",
  },
];

export const categories = [
  "All cards",
  "Shopping",
  "Gaming",
  "Entertainment",
  "Fashion",
] as const;
export type CategoryFilter = (typeof categories)[number];
const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});
export function formatNaira(amount: number) {
  return naira.format(amount);
}

export function getGiftCard(id: string): GiftCard | undefined {
  return giftCards.find((card) => card.id === id);
}
