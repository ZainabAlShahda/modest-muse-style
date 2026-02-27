export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'] as const;

export const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Best Rated', value: 'rating' },
  { label: 'Name A–Z', value: 'name-asc' },
] as const;

export const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'] as const;

export const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/shop?featured=true' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/modestmusestyle',
  pinterest: 'https://pinterest.com/modestmusestyle',
  facebook: 'https://facebook.com/modestmusestyle',
} as const;

export const BRAND = {
  name: 'Modest Muse Style',
  tagline: 'Elegant modest fashion for the modern woman.',
  email: 'hello@modestmusestyle.com',
} as const;
