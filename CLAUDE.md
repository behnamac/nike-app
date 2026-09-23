# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Nike-style e-commerce store: Next.js 15 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4, Neon Postgres via Drizzle ORM, custom session auth (with Better Auth mounted), Zustand, Stripe Checkout, Resend email, and a react-three-fiber 3D shoe on the home page.

## Commands

```bash
npm run dev              # next dev --turbopack (http://localhost:3000)
npm run build            # next build --turbopack
npm run lint             # eslint (flat config, next/core-web-vitals + typescript)
npx tsc --noEmit         # type check (no dedicated script)

npm run db:generate      # drizzle-kit generate -> ./drizzle
npm run db:push          # push schema straight to the DB
npm run db:migrate       # apply generated migrations
npm run db:seed          # tsx scripts/seed.ts (wipes and reseeds catalog, copies images)
npm run db:migrate-auth  # tsx scripts/migrate-auth.ts
```

There is no test framework. Check changes with `npm run lint`, `npx tsc --noEmit`, and by running the app.

## Environment (`.env.local`)

`drizzle.config.ts` and the scripts load `.env.local` explicitly. The code reads:
- `DATABASE_URL`: Neon connection string
- `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXTAUTH_URL` (the auth trustedOrigin and the base URL for email links), `NEXT_PUBLIC_APP_URL` (Stripe redirect URLs)
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`: optional. `src/lib/stripe/client.ts` exports `stripe = null` when the key is missing, so every caller must null-check it.
- `RESEND_API_KEY`: optional. Without it, the password-reset token is only logged to the console.
- `GOOGLE_CLIENT_ID/SECRET`: only used by the unused `src/lib/auth.ts`

## Architecture

### Data layer
- `src/lib/db.ts` exports a lazily created `db` (a Proxy around `getDb()`), so importing it never throws when `DATABASE_URL` is missing. Only a query throws.
- The real schema is split into one file per table under `src/lib/db/schema/` and re-exported from `schema/index.ts`, which is also the drizzle-kit schema entry. Relations live in `schema/relations.ts`. Filter lookup tables (colors, genders, sizes) are in `schema/filters/`.
- Catalog model: `products` → `productVariants` (color, size, price, salePrice, stock) and `productImages`. A product has a `defaultVariantId`. Prices and images come from variants and images, not from the product row.
- `drizzle/schema.ts` and `drizzle/relations.ts` are an old introspection (a flat `products` table with a serial id). Don't use them.

### Mock-data fallback (important)
The app is built to run without a working database:
- `getAllProducts` and related functions in `src/lib/actions/product.ts` run `SELECT 1` first and fall back to `src/lib/data/mock-products.ts` if it fails.
- For cart operations, `src/store/cart.store.ts` (a Zustand store persisted to localStorage) dynamically imports the server actions in `src/lib/actions/cart.ts`. On failure it falls back to `src/lib/actions/mock-cart.ts`, an in-memory Map keyed by the `mock_cart_id` cookie.
- The cart and product pages follow the same pattern. When you change a data shape, update both the DB path and the mock path, and keep `CartItem` / `CartItemWithDetails` / `MockCartItem` in sync.

### Server actions
- Mutations and data fetching live in `src/lib/actions/*.ts` and `src/lib/auth/actions.ts` (`"use server"`). They return `ActionResult<T> = { success, data?, error? }` instead of throwing, and validate input with Zod.
- Cookies can only be set inside Server Actions or Route Handlers, not while a Server Component renders. That's why `getOrCreateCart(createGuest)` only creates a guest session when `createGuest=true`, and otherwise returns `cartId: "empty"`.

### Auth
- The session system is custom, in `src/lib/auth/actions.ts`: bcrypt hashing, rows in the `session` table, and an `auth_session` httpOnly cookie. `getCurrentUser()` is the source of truth that everything else calls.
- Guests get a `guest_session` cookie backed by the `guest` table. Carts are keyed by `userId` or `guestId`. `signIn`/`signUp` and checkout call `mergeGuestCartWithUserCart`.
- Better Auth (`src/lib/auth/config.ts`) is mounted at `/api/auth/[...all]` but doesn't drive the app's sessions. `src/lib/auth.ts` is a second, unused Better Auth config.
- Password reset: `forgotPassword`/`resetPassword` store tokens in `verification`, and `src/lib/email.ts` sends mail through Resend.
- `middleware.ts` → `src/lib/auth/middleware.ts` redirects to `/sign-in?redirect=…` for any route outside its `publicRoutes` list. `/api/*` is excluded by the matcher. When you add a public page, add it to that list.
- Client side: `AuthProvider` in `src/lib/auth/context.tsx` wraps the root layout.

### Products, filtering, checkout
- `/products` is a Server Component. URL search params → `parseProductFilters` (`src/lib/utils/query.ts`, which resolves slugs to IDs) → `getAllProducts`. Filters and sort are client components that write to the URL through `query-string`.
- Checkout: `createStripeCheckoutSession` (`src/lib/actions/checkout.ts`) redirects to Stripe. The webhook at `src/app/api/stripe/route.ts` handles `checkout.session.completed` → `createOrder` (in `actions/orders.ts`) → `clearCart`. Success page: `/checkout/success`.

### Assets
- The seed script copies product images into `static/uploads/` and stores URLs as `/static/uploads/<productId>-<n>-<file>`. Other assets, including the 3D model in `public/model`, live in `public/`. `next.config.ts` allows remote images only from `static.nike.com`.
- Components are exported from `src/components/index.ts` and `src/components/auth/index.ts`. Imports use the `@/*` → `src/*` alias.
