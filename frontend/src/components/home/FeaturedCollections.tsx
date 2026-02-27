import Link from 'next/link';
import { api } from '@/lib/api';
import ProductCard from '@/components/shop/ProductCard';

async function getFeaturedProducts() {
  try {
    const res = await api.get('/products?featured=true&limit=4');
    return res.data.data || [];
  } catch {
    return [];
  }
}

export default async function FeaturedCollections() {
  const products = await getFeaturedProducts();

  return (
    <section className="container-wide py-24">
      <div className="flex items-end justify-between mb-12">
        <div>
          <span className="text-xs font-medium tracking-widest uppercase text-sand">Curated For You</span>
          <h2 className="font-serif text-4xl md:text-5xl text-charcoal mt-2">Featured Pieces</h2>
        </div>
        <Link href="/shop" className="btn-ghost hidden md:inline-flex items-center gap-2 text-sm">
          View All →
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-product bg-sand-50 rounded-xl" />
              <div className="h-4 bg-sand-50 rounded w-3/4" />
              <div className="h-4 bg-sand-50 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: any) => <ProductCard key={product._id} product={product} />)}
        </div>
      )}

      <div className="mt-8 text-center md:hidden">
        <Link href="/shop" className="btn-secondary">View All Products</Link>
      </div>
    </section>
  );
}
