import Link from 'next/link';
import { api } from '@/lib/api';

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

// Fallback placeholder colors per category index
const TILE_COLORS = [
  'bg-sage-50',
  'bg-blush-50',
  'bg-sand-50',
  'bg-cream-dark',
  'bg-sage-100',
  'bg-blush-100',
];

async function getCategories(): Promise<Category[]> {
  try {
    const res = await api.get('/categories?limit=8');
    return res.data.data || [];
  } catch {
    return [];
  }
}

export default async function CategoryTiles() {
  const categories = await getCategories();
  if (categories.length === 0) return null;

  return (
    <section className="container-wide py-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="text-xs font-medium tracking-widest uppercase text-sand">Browse By</span>
          <h2 className="font-serif text-4xl text-charcoal mt-2">Shop by Category</h2>
        </div>
        <Link href="/shop" className="btn-ghost hidden md:inline-flex items-center gap-2 text-sm">
          All Products →
        </Link>
      </div>

      {/* Horizontal scroll on mobile, grid on desktop */}
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-visible md:pb-0 scrollbar-none">
        {categories.map((cat, i) => (
          <Link
            key={cat._id}
            href={`/shop?category=${cat._id}`}
            className={`shrink-0 snap-start w-44 md:w-auto rounded-2xl overflow-hidden group relative aspect-square flex items-end p-5 cursor-pointer ${TILE_COLORS[i % TILE_COLORS.length]}`}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent rounded-2xl" />
            <p className="relative z-10 font-serif text-lg text-white leading-tight group-hover:text-sand transition-colors">
              {cat.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
