# Giftly

A digital gift-card storefront for the Nigerian market. Shoppers browse cards from
brands they know, pick a denomination, and pay through Paystack; the order is recorded
in Postgres and only marked paid once the transaction has been verified server-side.

Built with the Next.js App Router, TypeScript, Tailwind CSS v4, Supabase and Paystack.

---

## Features

**Storefront**
- Catalogue with client-side search and category filtering
- Category tiles that preselect the matching filter via shared context
- Per-brand denomination picker — the amount is chosen explicitly, never inferred
- Cart with per-denomination line items, persisted to `localStorage`

**Checkout**
- Two-step flow (delivery details → review) with a persistent order summary
- Zod-validated API boundary
- Paystack hosted checkout via redirect
- Server-side verification before an order is marked paid
- Failed or abandoned payments leave the cart intact so the shopper can retry

---

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (`@theme`, no config file) + design tokens in `globals.css` |
| UI primitives | Base UI (`@base-ui/react`) — dialog, sheet, accordion, radio group |
| Icons | Phosphor |
| Animation | Framer Motion |
| Database | Supabase (Postgres) |
| Payments | Paystack |
| Validation | Zod |
| Package manager | pnpm |

---

## Getting started

**Prerequisites:** Node 20+, pnpm, a Supabase project, and a Paystack account.

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

### Environment

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SECRET_KEY=<supabase service role key>   # server-only
PAYSTACK_SECRET_KEY=<sk_test_... or sk_live_...>  # server-only
NEXT_PUBLIC_APP_URL=http://localhost:3000         # Paystack redirects back here
RESEND_API_KEY=<re_...>                           # server-only, order confirmation emails
EMAIL_FROM="Giftly <orders@your-verified-domain>" # sender on a domain verified in Resend
SUPPORT_EMAIL=<help@your-domain>                  # optional, shown in the email footer
```

`NEXT_PUBLIC_APP_URL` must match the origin you're serving from — Paystack uses it to
build the `callback_url` it returns the shopper to after payment.

When an order flips to `paid`, `settleOrderPayment` emails the customer a confirmation
through [Resend](https://resend.com). The email is sent once per order (only the request
that wins the `pending → paid` update sends it), and a delivery failure is logged without
affecting the payment. If `RESEND_API_KEY` or `EMAIL_FROM` is missing, no email is sent.

### Database

The app expects two tables:

```sql
create table orders (
  id                uuid primary key default gen_random_uuid(),
  customer_name     text        not null,
  customer_email    text        not null,
  total_amount_kobo integer     not null,
  payment_status    text        not null default 'pending', -- pending | paid | failed
  payment_reference text        unique,
  created_at        timestamptz not null default now()
);

create table order_items (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid    not null references orders(id) on delete cascade,
  product_id      text    not null,
  product_name    text    not null,
  quantity        integer not null,
  unit_price_kobo integer not null
);
```

Amounts are stored in **kobo** (integer minor units) rather than naira decimals —
Paystack expects kobo, and integers avoid floating-point rounding on money.

---

## Payment flow

```
Cart → POST /api/checkout → Paystack hosted page → /checkout/success
                 │                                        │
                 │                                        └─ GET /api/checkout/verify
                 └─ creates order (pending) + order_items     ├─ asks Paystack for truth
                    returns authorization_url                 ├─ updates payment_status
                                                              └─ cart cleared only on success
```

1. **`POST /api/checkout`** validates the payload with Zod, rejects any denomination not
   listed for that product in the server-side catalogue, computes the order total itself,
   writes the order as `pending`, and initialises a Paystack transaction.
2. **Paystack** handles the payment and redirects back to `/checkout/success`.
3. **`GET /api/checkout/verify`** is the only thing that can mark an order paid. It
   calls Paystack's verify endpoint using the secret key and compares the returned
   amount against the stored total.

Three details worth pointing out:

- **The client never sends a price.** The request carries only `productId`,
  `denomination` and `quantity` — there is no price or total field to tamper with. The
  denomination is checked against the catalogue before any money is calculated.
- **Verification is idempotent.** Once an order is `paid` or `failed` the route returns
  the stored result without calling Paystack again, so reloading the success page can't
  flip an outcome or double-count.
- **Transient failures don't corrupt state.** If Paystack is unreachable the order stays
  `pending` and returns a 502, so it remains reconcilable on a later visit rather than
  being wrongly marked failed.

---

## Notable implementation details

**Cart identity.** Line items are keyed by `(id, denomination)`, not brand alone — the
same card at ₦5,000 and ₦20,000 is two distinct lines. Quantity changes and removals
match on both fields (`isSameLine` in `lib/cart.tsx`).

**Cart lifetime.** The cart is deliberately *not* cleared when the shopper leaves for
Paystack. It's cleared on `/checkout/success` only after verification succeeds, so a
declined card or an abandoned payment doesn't wipe their basket.

**Hydration-safe motion.** `prefers-reduced-motion` can't be known during SSR, so
branching on `useReducedMotion()` in render produces a different tree on the client and
breaks hydration. Instead a single `<MotionConfig reducedMotion="user">`
(`components/ui/motion-provider.tsx`) wraps the app: one DOM tree everywhere, with
Framer suppressing transform and layout animation for users who ask for it.

**No-JS safety net.** Framer serialises its `initial` state into inline styles during
SSR, which would leave scroll-revealed sections permanently invisible without
JavaScript. A `<noscript>` rule in the root layout forces `[data-reveal]` and
`[data-page-transition]` visible.

**Rendering.** Every page prerenders as static HTML; only the cart, catalogue filter,
checkout and hero interactions are client components. `useSearchParams` on the success
page sits behind a `<Suspense>` boundary so the route keeps its static shell.

**Accessibility.** Interactive primitives come from Base UI, so roles, `aria-expanded`
and keyboard navigation are handled by the library rather than reimplemented. Sections
are labelled with `aria-labelledby`, the denomination picker is a real radio group, and
form fields carry `autoComplete` and described-by hints.

---

## Project structure

```
app/
  page.tsx                    storefront (server component)
  gift-cards/[id]/            product detail, statically generated per brand
  cart/  checkout/            cart and two-step checkout
  checkout/success/           post-payment verification screen
  api/checkout/               order creation
  api/checkout/verify/        server-side payment verification
  globals.css                 design tokens + component styles
components/
  home/                       storefront sections
  cart/  checkout/            cart and checkout UI
  gift-cards/                 artwork, denomination picker, add-to-cart
  ui/                         Base UI wrappers + motion primitives
lib/
  cart.tsx                    cart reducer and localStorage persistence
  gift-cards.ts               catalogue and naira formatting
  paystack/paystack.ts        initialise + verify transactions
  supabase/server.ts          server-only Supabase client
  api/checkout-client.ts      typed client for the checkout endpoints
```

---

## Scripts

```bash
pnpm dev      # development server
pnpm build    # production build
pnpm start    # serve the production build
pnpm lint     # eslint
```

---

## Known gaps

- **No Paystack webhook yet.** Verification runs when the shopper's browser returns to
  `/checkout/success`. If they pay and close the tab before the redirect completes, the
  order stays `pending` with nothing to reconcile it. A signed webhook endpoint is the
  fix and needs a public HTTPS URL to register against.
- **The gift message isn't persisted.** It's collected at checkout but has no field in
  the checkout schema or the `orders` table, so it's currently dropped.
- **`/api/test-db`** is an unauthenticated debug route that returns raw `orders` rows.
  It should be removed or protected before deploying.
