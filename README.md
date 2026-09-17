# Giftly homepage

A frontend gift-card storefront built with Next.js App Router, TypeScript,
Tailwind CSS v4, shadcn/ui with Base UI primitives, and Phosphor icons.

## Run locally

From the `giftly` directory, run `pnpm install` and `pnpm dev`, then open
http://localhost:3000. Use `pnpm build` and `pnpm start` for a production preview.

## Structure

- `app/page.tsx` composes the homepage sections as a Server Component.
- `app/layout.tsx` owns metadata, the local Geist font, and the shared site shell.
- `components/home/` contains the hero, interactive collection, and how-it-works section.
- `components/gift-cards/card-artwork.tsx` supplies reusable, scalable brand artwork.
- `components/layout/` contains the shared header and footer.
- `components/ui/` contains shadcn-style Button and Dialog primitives built on Base UI.
- `lib/gift-cards.ts` holds typed demo catalogue data and naira formatting.
- `app/globals.css` holds the theme tokens and custom artwork/responsive styling.

Client rendering is limited to the navigation dialogs and interactive catalogue.
Category filters and previews operate locally. The dialogs use Base UI focus
management, keyboard dismissal, and accessible titles. Motion respects the
system's reduced-motion preference.

## Visual conventions

Shared theme tokens in `app/globals.css` define neutral surfaces, the warm brand
accent, spacing, and corner radii. Standard buttons are 44px tall, primary hero
and banner links use the same 48px large variant, and only filter controls use
the pill shape. Keep these rules in `components/ui/button.tsx` instead of adding
individual size or radius overrides. Dialog titles and descriptions also have
shared defaults. Main sections use 64px vertical spacing on mobile and 80px on
larger screens; cards use 24px content padding and 16px corners. Brand artwork
keeps its own colours within the neutral interface.

## Review scope

This phase implements the homepage only. The product buttons open previews;
the cart shows an empty state. Product, cart, and checkout pages, purchases,
email delivery, authentication, and payment integrations are not implemented.
Catalogue prices are demonstration content. Brand artwork is illustrative.

Geist is bundled locally from the existing project's font cache, so builds do
not require a Google Fonts request. Upstream font and licensing information:
https://github.com/vercel/geist-font

## Checks

```sh
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

For visual review, check the page at mobile, tablet, and desktop widths. Try each
category filter, open and dismiss every card preview, and open the empty cart.
Check keyboard focus, Escape dismissal, and reduced-motion behaviour.
