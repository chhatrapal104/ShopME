# ShopWave — Frontend E-Commerce Project

A production-grade frontend built to showcase **4 years of React + Next.js experience**.
No backend, no database — pure frontend craft.

---

## What this project demonstrates

| Skill | Implementation |
|-------|---------------|
| **Next.js App Router** | Server Components, `loading.tsx` Suspense, `generateMetadata`, ISR |
| **React Patterns** | Custom hooks, compound components, optimistic UI |
| **Framer Motion** | Page transitions, AnimatePresence, layout animations, micro-interactions |
| **TanStack Query** | Infinite scroll, caching, background refetch, devtools |
| **Zustand** | Cart + Wishlist state with devtools + persist middleware |
| **Dark Mode** | `next-themes` system-aware toggle with animated sun/moon icon |
| **Custom Hooks** | `useDebounce`, `useIntersectionObserver`, `useLocalStorage`, `useWindowSize` |
| **TypeScript** | Strict mode, discriminated unions, utility types throughout |
| **Skeleton Loaders** | `loading.tsx` files for every route, shimmer skeletons |
| **URL State** | Filters synced to URL search params (shareable links) |
| **Accessibility** | ARIA labels, keyboard navigation, focus management |
| **Performance** | `next/image` optimization, `next/font`, memoization, lazy loading |

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict)
- **UI**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Server State**: TanStack Query v5
- **Client State**: Zustand v5
- **Data Source**: DummyJSON public API (no backend needed)
- **Theme**: next-themes (dark/light/system)

---

## Setup — Run these commands in order

```bash
# 1. Install all dependencies
npm install

# 2. Install shadcn/ui components (all at once)
npx shadcn@latest add button input label badge avatar separator select dropdown-menu toast skeleton dialog

# 3. Start the dev server
npm run dev
```

Open **http://localhost:3000** — that's it. No .env file needed!

---

## Project Structure

```
digital-store-v2/
├── app/
│   ├── layout.tsx              # Root layout — Providers, Navbar, Footer
│   ├── page.tsx                # Homepage — Hero, Categories, Featured products
│   ├── not-found.tsx           # 404 page
│   ├── products/
│   │   ├── page.tsx            # Product listing with filters
│   │   ├── loading.tsx         # Skeleton loader (Suspense boundary)
│   │   └── [slug]/
│   │       ├── page.tsx        # Product detail — SSR with generateMetadata
│   │       └── loading.tsx     # Detail skeleton loader
│   ├── cart/
│   │   └── page.tsx            # Cart — animated list, quantity controls
│   └── wishlist/
│       └── page.tsx            # Wishlist — animated grid
│
├── components/
│   ├── navbar.tsx              # Sticky, animated, scroll-aware, mobile menu
│   ├── product-card.tsx        # Animated card — wishlist, add to cart
│   ├── product-skeleton.tsx    # Shimmer skeletons for grid and detail
│   ├── infinite-product-grid.tsx  # TanStack infinite scroll with sentinel ref
│   ├── search-filters.tsx      # Debounced search + URL-synced filters
│   ├── add-to-cart-section.tsx # Quantity picker + animated CTA
│   ├── theme-toggle.tsx        # Animated sun/moon dark mode toggle
│   └── providers.tsx           # QueryClient + ThemeProvider
│
├── hooks/
│   ├── use-cart.ts             # Zustand cart with devtools + persist
│   ├── use-wishlist.ts         # Zustand wishlist with devtools + persist
│   ├── use-debounce.ts         # Delay value updates for search inputs
│   ├── use-intersection-observer.ts  # Trigger infinite scroll
│   ├── use-local-storage.ts    # SSR-safe localStorage hook
│   └── use-window-size.ts      # Responsive breakpoint detection
│
├── lib/
│   ├── api.ts                  # DummyJSON API functions with Next.js caching
│   └── utils.ts                # cn(), formatPrice(), capitalize() etc.
│
└── types/
    └── index.ts                # TypeScript interfaces for Product, Cart, Filters
```

---

## Pages & Features

| Page | URL | Highlights |
|------|-----|-----------|
| Home | `/` | Hero, category grid, featured products, CTA |
| Products | `/products` | Infinite scroll, debounced search, URL filters, skeleton loaders |
| Product Detail | `/products/[id]` | SSR, metadata, image gallery, related products, quantity picker |
| Cart | `/cart` | Animated add/remove, quantity control, shipping calculator |
| Wishlist | `/wishlist` | Animated grid, move to cart, persistent across sessions |

---

## Things to show in interviews

1. **`hooks/use-intersection-observer.ts`** — explain how you built infinite scroll from scratch using the Intersection Observer API
2. **`hooks/use-debounce.ts`** — show how it prevents API over-fetching on every keystroke
3. **`components/infinite-product-grid.tsx`** — demonstrate TanStack Query's `useInfiniteQuery` pattern
4. **`components/navbar.tsx`** — animated `layoutId` underline, scroll-aware styling
5. **`hooks/use-local-storage.ts`** — SSR-safe, cross-tab sync, generic type `<T>`
6. **`app/products/loading.tsx`** — Next.js built-in Suspense with skeleton UI
