import type { Metadata } from 'next';
import ProductGrid from '@/components/shop/ProductGrid';
import ProductFilters from '@/components/shop/ProductFilters';
import SortDropdown from '@/components/shop/SortDropdown';
import Breadcrumb from '@/components/layout/Breadcrumb';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse our complete collection of modest, elegant clothing.',
};

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    size?: string;
    color?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
    search?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  return (
    <div className="container-wide py-8">
      <Breadcrumb items={[{ label: 'Shop' }]} />
      <div className="mt-6 mb-8">
        <h1 className="font-serif text-4xl text-charcoal">The Collection</h1>
        <p className="mt-2 text-charcoal-muted">Elegant modest fashion, thoughtfully curated.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <ProductFilters searchParams={params} />
        </aside>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-charcoal-muted">Showing results</p>
            <SortDropdown currentSort={params.sort} />
          </div>
          <ProductGrid searchParams={params} />
        </div>
      </div>
    </div>
  );
}
