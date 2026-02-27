# Gul Ahmed Shop — Feature Analysis & Implementation Plan

## Reference
https://www.gulahmedshop.com

---

## Key Features Observed

### 1. Header & Navigation
- **Announcement / Marquee bar** — scrolling promotional text strip above the header (e.g., "Free shipping on orders over Rs.X | New arrivals now live")
- **Mega menu** — multi-level dropdown with subcategories per nav item
- **Search overlay** — prominent search with predictive suggestions & "Top Searches" chips
- **Wishlist counter badge** — heart icon in header with item count bubble
- **Cart counter badge** — bag icon with item count (already implemented)

### 2. Home Page
- **Hero image carousel/slider** — full-width auto-sliding banner with navigation arrows & dot indicators (vs. our current static hero)
- **Popular / Shop by Category section** — horizontal scrollable row of category tiles with images
- **Sale / Promotional banner section** — dedicated full-width promotional strip with CTA
- **New Arrivals grid** — dedicated section (vs. our generic "Featured Pieces")
- **Testimonials** — already implemented

### 3. Product Listing (Shop Page)
- **Low-stock indicator** — "Only X left!" warning on cards when stock ≤ 5
- **"Hot Stock" badge** — visually highlight near-sold-out items
- **Quick view modal** — view product details in a lightbox without leaving the listing
- **Color filter** — filter products by color in the sidebar (alongside existing size/price/category)
- **Active filter chips** — show applied filters as removable chips at top of grid

### 4. Product Detail Page
- **Size guide modal** — popup with size chart measurements table
- **Delivery estimate** — "Estimated delivery: X–X days" info near add-to-cart
- **Return policy snippet** — short returns/exchange policy inline

### 5. Order Tracking
- **Order tracking page** (`/track-order`) — form to enter order number + email; displays order status, items, shipping address

### 6. Footer
- **Payment method icons row** — logos for Visa, Mastercard, JazzCash, EasyPaisa, COD
- **Policy links** — Shipping Policy, Returns & Exchange, FAQ
- **"Back to Top" button** — smooth scroll to top

---

## Implementation Plan (Priority Order)

| # | Feature | Location | Status |
|---|---------|----------|--------|
| 1 | Announcement bar (marquee) | Header (above) | ⬜ TODO |
| 2 | Wishlist counter in header | Header | ⬜ TODO |
| 3 | Search overlay (with live results) | Header search button | ⬜ TODO |
| 4 | Hero carousel (3 slides) | Home page | ⬜ TODO |
| 5 | Shop by Category section | Home page | ⬜ TODO |
| 6 | Promotional sale banner | Home page | ⬜ TODO |
| 7 | Low-stock badge on product cards | ProductCard | ⬜ TODO |
| 8 | Quick view modal | ProductCard / Shop page | ⬜ TODO |
| 9 | Active filter chips | Shop page (ProductFilters) | ⬜ TODO |
| 10 | Color filter | Shop page (ProductFilters) | ⬜ TODO |
| 11 | Size guide modal | Product detail page | ⬜ TODO |
| 12 | Order tracking page | /track-order | ⬜ TODO |
| 13 | Payment icons in footer | Footer | ⬜ TODO |
| 14 | Back-to-top button | Global layout | ⬜ TODO |
