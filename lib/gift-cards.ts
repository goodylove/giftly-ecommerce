export type GiftCardBrand = "amazon" | "apple" | "playstation" | "nike" | "spotify-premium" | "steam" | "walmart" | "uber";
export type GiftCardCategory = "Shopping" | "Gaming" | "Entertainment" | "Fashion";

export interface GiftCard {
  id: GiftCardBrand;
  brand: string;
  name: string;
  category: GiftCardCategory;
  description: string;
  startingPrice: number;
  imageSrc?: string;
}

// Selected names, descriptions, categories, and artwork adapted from the user's
// ecommerce/lib/constants.ts catalogue. NGN prices are Giftly demo amounts,
// not conversions of the source catalogue's USD denominations.
export const giftCards: readonly GiftCard[] = [
  { id: "amazon", brand: "Amazon", name: "Amazon Gift Card", category: "Shopping", description: "Shop books, electronics, everyday essentials, and more on Amazon.", startingPrice: 5000 },
  { id: "apple", brand: "Apple", name: "Apple Gift Card", category: "Entertainment", description: "Explore apps, games, music, and more across the Apple ecosystem.", startingPrice: 5000, imageSrc: "/gift-cards/apple.svg" },
  { id: "playstation", brand: "PlayStation", name: "PlayStation Gift Card", category: "Gaming", description: "Purchase games, add-ons, subscriptions, and more from the PlayStation Store.", startingPrice: 5000, imageSrc: "/gift-cards/playstation.svg" },
  { id: "nike", brand: "Nike", name: "Nike Gift Card", category: "Fashion", description: "Shop the latest Nike sneakers, apparel, and gear.", startingPrice: 5000, imageSrc: "/gift-cards/nike.svg" },
  { id: "spotify-premium", brand: "Spotify", name: "Spotify Premium Gift Card", category: "Entertainment", description: "Enjoy ad-free music, offline downloads, and premium features with Spotify Premium.", startingPrice: 5000, imageSrc: "/gift-cards/spotify-premium.svg" },
  { id: "steam", brand: "Steam", name: "Steam Gift Card", category: "Gaming", description: "Discover PC games, new releases, and downloadable content on Steam.", startingPrice: 5000 },
  { id: "walmart", brand: "Walmart", name: "Walmart Gift Card", category: "Shopping", description: "Shop groceries, electronics, clothing, and more at Walmart.", startingPrice: 5000, imageSrc: "/gift-cards/walmart.svg" },
  { id: "uber", brand: "Uber", name: "Uber Gift Card", category: "Shopping", description: "Get rides or order food with Uber and Uber Eats.", startingPrice: 5000, imageSrc: "/gift-cards/uber.svg" },
];

export const categories = ["All cards", "Shopping", "Gaming", "Entertainment", "Fashion"] as const;
export type CategoryFilter = (typeof categories)[number];
const naira = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });
export function formatNaira(amount: number) { return naira.format(amount); }
