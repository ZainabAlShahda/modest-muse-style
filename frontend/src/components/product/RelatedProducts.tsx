import { api } from '@/lib/api';
import ProductCard from '@/components/shop/ProductCard';

interface RelatedProductsProps {
  categoryId: string;
  currentSlug: string;
}

async function getRelated(categoryId: string, currentSlug: string) {
  try {
    const res = await api.get(`/products?category=${categoryId}&limit=4`);
    return (res.data.data || []).filter((p: any) => p.slug !== currentSlug).slice(0, 4);
  } catch {
    return [];
  }
}

export default async function RelatedProducts({ categoryId, currentSlug }: RelatedProductsProps) {
  if (!categoryId) return null;
  const products = await getRelated(categoryId, currentSlug);
  if (products.length === 0) return null;

  return (
    <section className="mt-20 pt-12 border-t border-sand-100">
      <h2 className="font-serif text-3xl text-charcoal mb-8">You May Also Like</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product: any) => <ProductCard key={product._id} product={product} />)}
      </div>
    </section>
  );
}
