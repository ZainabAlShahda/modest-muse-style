import { api } from '@/lib/api';
import ProductCard from './ProductCard';
import Pagination from './Pagination';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

interface ProductGridProps {
  searchParams: Record<string, string | undefined>;
}

async function getProducts(params: Record<string, string | undefined>) {
  try {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) query.set(k, v); });
    const res = await api.get(`/products?${query.toString()}`);
    return res.data;
  } catch {
    return { data: [], meta: null };
  }
}

export default async function ProductGrid({ searchParams }: ProductGridProps) {
  const { data: products, meta } = await getProducts(searchParams);

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-charcoal-muted text-lg">No products found.</p>
        <p className="text-sm text-charcoal-muted mt-2">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {products.map((product: any) => <ProductCard key={product._id} product={product} />)}
      </div>

      {meta && <Pagination meta={meta} />}
    </div>
  );
}
