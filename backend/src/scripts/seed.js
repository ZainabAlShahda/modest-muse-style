/**
 * Seed script — creates admin user, categories, and 12 sample products.
 * Run: npm run seed --workspace=backend
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const ADMIN = {
  name: 'Admin',
  email: 'admin@modestmusestyle.com',
  password: 'AdminPass123!',
  role: 'admin',
};

const CATEGORIES = [
  { name: 'Abayas',            slug: 'abayas',             description: 'Elegant full-length abayas for every occasion', order: 1 },
  { name: 'Maxi Dresses',      slug: 'maxi-dresses',       description: 'Floor-length modest dresses', order: 2 },
  { name: 'Modest Tops',       slug: 'modest-tops',        description: 'Longline and modest tops & tunics', order: 3 },
  { name: 'Wide Leg Trousers', slug: 'wide-leg-trousers',  description: 'Modest wide-leg and palazzo bottoms', order: 4 },
  { name: 'Outerwear',         slug: 'outerwear',          description: 'Coats, capes, and cover-ups', order: 5 },
];

let _skuCounter = 100;
const makeVariants = (sizes, colors) =>
  sizes.flatMap((size) =>
    colors.map((color) => ({
      size,
      color: color.name,
      colorHex: color.hex,
      stock: Math.floor(Math.random() * 25) + 4,
      sku: `MMS-${String(++_skuCounter).padStart(3, '0')}-${size.padEnd(3, '_')}-${color.name.replace(/\s+/g, '').slice(0, 3).toUpperCase()}`,
    }))
  );

// Colour palettes
const NEUTRALS = [
  { name: 'Black', hex: '#1A1A1A' },
  { name: 'Ivory', hex: '#FAF8F2' },
  { name: 'Stone', hex: '#D4C5B0' },
];
const EARTH = [
  { name: 'Camel',    hex: '#C19A6B' },
  { name: 'Charcoal', hex: '#2D2D2D' },
  { name: 'Sage',     hex: '#4A8A36' },
];
const PASTELS = [
  { name: 'Dusty Rose',  hex: '#E8A8A8' },
  { name: 'Powder Blue', hex: '#B8D4E0' },
  { name: 'Lavender',    hex: '#C9C0D8' },
];
const FOREST = [
  { name: 'Forest Green', hex: '#2D5A1B' },
  { name: 'Ivory',        hex: '#FAF8F2' },
  { name: 'Stone',        hex: '#D4C5B0' },
];
const OCCASION = [
  { name: 'Midnight Navy', hex: '#1B2A4A' },
  { name: 'Black',         hex: '#1A1A1A' },
  { name: 'Burgundy',      hex: '#6B1D2E' },
];

const makeSampleProducts = (cat) => [
  // ── ABAYAS ──────────────────────────────────────────────────
  {
    name: 'Amal Open Abaya',
    slug: 'amal-open-abaya',
    description: 'A gracefully draped open-front abaya with delicate hand-embroidery at the cuffs and hem. Crafted from premium chiffon that catches light beautifully with every step.',
    price: 149,
    compareAtPrice: 189,
    category: cat['Abayas'],
    fabric: '100% Premium Chiffon',
    careInstructions: ['Hand wash in cold water', 'Do not tumble dry', 'Iron on low heat', 'Dry flat'],
    tags: ['abaya', 'chiffon', 'embroidered', 'bestseller'],
    isFeatured: true,
    isPublished: true,
    images: [{ url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80', alt: 'Amal Open Abaya — front view', isCover: true }],
    variants: makeVariants(['XS', 'S', 'M', 'L', 'XL', 'XXL'], NEUTRALS),
    ratingsAverage: 4.8,
    ratingsCount: 42,
  },
  {
    name: 'Safa Embroidered Abaya',
    slug: 'safa-embroidered-abaya',
    description: 'A showstopping occasion abaya featuring intricate floral embroidery along the neckline and bell sleeves. Made from lightweight satin for a beautiful, fluid drape.',
    price: 199,
    compareAtPrice: 249,
    category: cat['Abayas'],
    fabric: '100% Satin Polyester',
    careInstructions: ['Hand wash cold', 'Do not wring', 'Dry flat', 'Cool iron on reverse'],
    tags: ['abaya', 'satin', 'embroidered', 'occasion', 'new'],
    isFeatured: true,
    isPublished: true,
    images: [{ url: 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=800&q=80', alt: 'Safa Embroidered Abaya', isCover: true }],
    variants: makeVariants(['XS', 'S', 'M', 'L', 'XL'], OCCASION),
    ratingsAverage: 4.9,
    ratingsCount: 28,
  },
  {
    name: 'Zara Belted Abaya',
    slug: 'zara-belted-abaya',
    description: 'A modern structured abaya with a removable fabric belt to define your silhouette. Concealed front buttons and patch pockets add practicality to pure elegance.',
    price: 169,
    category: cat['Abayas'],
    fabric: '100% Crepe Fabric',
    careInstructions: ['Machine wash cold', 'Hang to dry', 'Iron on medium'],
    tags: ['abaya', 'belted', 'crepe', 'modern'],
    isFeatured: false,
    isPublished: true,
    images: [{ url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80', alt: 'Zara Belted Abaya', isCover: true }],
    variants: makeVariants(['S', 'M', 'L', 'XL', 'XXL'], EARTH),
    ratingsAverage: 4.6,
    ratingsCount: 17,
  },

  // ── MAXI DRESSES ────────────────────────────────────────────
  {
    name: 'Nadia Maxi Wrap Dress',
    slug: 'nadia-maxi-wrap-dress',
    description: 'A flowing maxi wrap dress with a modest neckline and long sleeves. The relaxed fit and luxurious viscose blend make it perfect for both everyday wear and special occasions.',
    price: 119,
    compareAtPrice: 149,
    category: cat['Maxi Dresses'],
    fabric: '95% Viscose, 5% Elastane',
    careInstructions: ['Machine wash cold', 'Tumble dry low', 'Cool iron'],
    tags: ['maxi', 'wrap', 'viscose', 'summer', 'bestseller'],
    isFeatured: true,
    isPublished: true,
    images: [{ url: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&q=80', alt: 'Nadia Maxi Wrap Dress', isCover: true }],
    variants: makeVariants(['XS', 'S', 'M', 'L', 'XL', 'XXL'], EARTH),
    ratingsAverage: 4.7,
    ratingsCount: 56,
  },
  {
    name: 'Leila Tiered Maxi',
    slug: 'leila-tiered-maxi',
    description: 'Romantic tiered maxi dress in a soft chiffon fabric. The A-line silhouette, smocked waist, and covered sleeves create a dreamy look for garden parties or everyday elegance.',
    price: 109,
    category: cat['Maxi Dresses'],
    fabric: '100% Polyester Chiffon',
    careInstructions: ['Hand wash cold', 'Line dry', 'Cool iron'],
    tags: ['maxi', 'tiered', 'chiffon', 'romantic'],
    isFeatured: false,
    isPublished: true,
    images: [{ url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80', alt: 'Leila Tiered Maxi Dress', isCover: true }],
    variants: makeVariants(['XS', 'S', 'M', 'L', 'XL'], PASTELS),
    ratingsAverage: 4.5,
    ratingsCount: 31,
  },
  {
    name: 'Amira Shirt Maxi Dress',
    slug: 'amira-shirt-maxi-dress',
    description: 'A crisp linen-blend shirt dress with a floor-length hemline, buttoned placket, and long sleeves. Effortlessly minimal and seasonless — wear it belted or loose.',
    price: 129,
    compareAtPrice: 159,
    category: cat['Maxi Dresses'],
    fabric: '55% Linen, 45% Cotton',
    careInstructions: ['Machine wash 30°', 'Tumble dry low', 'Iron on medium'],
    tags: ['maxi', 'shirt-dress', 'linen', 'minimal'],
    isFeatured: false,
    isPublished: true,
    images: [{ url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80', alt: 'Amira Shirt Maxi Dress', isCover: true }],
    variants: makeVariants(['S', 'M', 'L', 'XL', 'XXL'], NEUTRALS),
    ratingsAverage: 4.4,
    ratingsCount: 22,
  },

  // ── MODEST TOPS ──────────────────────────────────────────────
  {
    name: 'Rania Longline Tunic',
    slug: 'rania-longline-tunic',
    description: 'A versatile longline tunic with subtle side slits for ease of movement. The relaxed drape, covered neckline, and bamboo viscose fabric make it a wardrobe essential.',
    price: 79,
    compareAtPrice: 99,
    category: cat['Modest Tops'],
    fabric: '100% Bamboo Viscose',
    careInstructions: ['Machine wash cold', 'Hang dry', 'Do not bleach'],
    tags: ['tunic', 'longline', 'bamboo', 'everyday', 'bestseller'],
    isFeatured: true,
    isPublished: true,
    images: [{ url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80', alt: 'Rania Longline Tunic', isCover: true }],
    variants: makeVariants(['XS', 'S', 'M', 'L', 'XL', 'XXL'], FOREST),
    ratingsAverage: 4.8,
    ratingsCount: 73,
  },
  {
    name: 'Dina Smocked Blouse',
    slug: 'dina-smocked-blouse',
    description: 'A flowy smocked blouse with bishop sleeves and a modest covered neckline. The elasticated cuffs and waist give a flattering fit while the lightweight cotton keeps you cool.',
    price: 65,
    category: cat['Modest Tops'],
    fabric: '100% Cotton Voile',
    careInstructions: ['Machine wash cold, gentle cycle', 'Line dry', 'Warm iron'],
    tags: ['blouse', 'smocked', 'cotton', 'flowy'],
    isFeatured: false,
    isPublished: true,
    images: [{ url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80', alt: 'Dina Smocked Blouse', isCover: true }],
    variants: makeVariants(['XS', 'S', 'M', 'L', 'XL'], PASTELS),
    ratingsAverage: 4.3,
    ratingsCount: 18,
  },

  // ── WIDE LEG TROUSERS ────────────────────────────────────────
  {
    name: 'Hana Pleated Palazzo',
    slug: 'hana-pleated-palazzo',
    description: 'Wide-leg palazzo trousers with an elastic waistband and elegant box pleating. The crepe fabric holds its shape beautifully — pair with a tunic or longline blouse for a polished look.',
    price: 89,
    compareAtPrice: 109,
    category: cat['Wide Leg Trousers'],
    fabric: '100% Crepe',
    careInstructions: ['Hand wash or delicate cycle', 'Hang to dry', 'Iron on medium'],
    tags: ['palazzo', 'wide-leg', 'crepe', 'comfortable'],
    isFeatured: true,
    isPublished: true,
    images: [{ url: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=800&q=80', alt: 'Hana Pleated Palazzo Trousers', isCover: true }],
    variants: makeVariants(['XS', 'S', 'M', 'L', 'XL', 'XXL'], [
      { name: 'Charcoal', hex: '#2D2D2D' },
      { name: 'Sage',     hex: '#4A8A36' },
      { name: 'Camel',    hex: '#C19A6B' },
    ]),
    ratingsAverage: 4.6,
    ratingsCount: 38,
  },
  {
    name: 'Mariam Linen Wide Leg',
    slug: 'mariam-linen-wide-leg',
    description: 'Relaxed wide-leg trousers in a breathable linen-cotton blend. The high-waist fit, side pockets, and raw-hem detail give these a clean contemporary edge for warm-weather days.',
    price: 95,
    category: cat['Wide Leg Trousers'],
    fabric: '60% Linen, 40% Cotton',
    careInstructions: ['Machine wash 30°', 'Line dry', 'Iron while damp'],
    tags: ['linen', 'wide-leg', 'summer', 'minimalist'],
    isFeatured: false,
    isPublished: true,
    images: [{ url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80', alt: 'Mariam Linen Wide Leg Trousers', isCover: true }],
    variants: makeVariants(['XS', 'S', 'M', 'L', 'XL'], NEUTRALS),
    ratingsAverage: 4.4,
    ratingsCount: 24,
  },

  // ── OUTERWEAR ────────────────────────────────────────────────
  {
    name: 'Layla Cocoon Coat',
    slug: 'layla-cocoon-coat',
    description: 'A structured cocoon coat with concealed buttons and a generous silhouette that layers beautifully over any outfit. Crafted from a premium wool blend for enduring warmth and elegance.',
    price: 229,
    compareAtPrice: 279,
    category: cat['Outerwear'],
    fabric: '70% Wool, 30% Polyester',
    careInstructions: ['Dry clean only', 'Store on a hanger', 'Do not machine wash'],
    tags: ['coat', 'wool', 'winter', 'structured', 'bestseller'],
    isFeatured: true,
    isPublished: true,
    images: [{ url: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=800&q=80', alt: 'Layla Cocoon Coat', isCover: true }],
    variants: makeVariants(['XS', 'S', 'M', 'L', 'XL'], [
      { name: 'Camel',    hex: '#C19A6B' },
      { name: 'Charcoal', hex: '#2D2D2D' },
      { name: 'Ivory',    hex: '#FAF8F2' },
    ]),
    ratingsAverage: 4.9,
    ratingsCount: 45,
  },
  {
    name: 'Yasmine Draped Cape',
    slug: 'yasmine-draped-cape',
    description: 'An effortlessly chic draped cape in a fine knit fabric. The oversized silhouette provides full coverage and warmth while remaining lightweight enough for transitional seasons.',
    price: 159,
    compareAtPrice: 199,
    category: cat['Outerwear'],
    fabric: '80% Acrylic, 20% Wool',
    careInstructions: ['Hand wash cold', 'Lay flat to dry', 'Do not iron'],
    tags: ['cape', 'knit', 'autumn', 'versatile', 'new'],
    isFeatured: false,
    isPublished: true,
    images: [{ url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80', alt: 'Yasmine Draped Cape', isCover: true }],
    variants: makeVariants(['S', 'M', 'L', 'XL'], [
      { name: 'Forest Green', hex: '#2D5A1B' },
      { name: 'Burgundy',     hex: '#6B1D2E' },
      { name: 'Stone',        hex: '#D4C5B0' },
    ]),
    ratingsAverage: 4.7,
    ratingsCount: 19,
  },
];

async function seed() {
  console.log('\n🌱 Starting Modest Muse Style seed script…\n');

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  await Promise.all([
    User.deleteMany({ email: ADMIN.email }),
    Category.deleteMany({}),
    Product.deleteMany({}),
  ]);
  console.log('🗑  Cleared existing seed data');

  const admin = await User.create(ADMIN);
  console.log(`👤 Admin: ${admin.email}`);

  const createdCats = await Category.insertMany(CATEGORIES);
  const cat = Object.fromEntries(createdCats.map((c) => [c.name, c._id]));
  console.log(`🏷  ${createdCats.length} categories created`);

  const products = makeSampleProducts(cat);
  const created = await Product.insertMany(products);
  console.log(`👗 ${created.length} products created`);

  console.log('\n✨ Seed complete!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  Admin email    : ${ADMIN.email}`);
  console.log(`  Admin password : ${ADMIN.password}`);
  console.log(`  Products       : ${created.length} across ${createdCats.length} categories`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('\n❌ Seed failed:', err.message);
  console.error(err);
  process.exit(1);
});
