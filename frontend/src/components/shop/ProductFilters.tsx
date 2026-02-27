'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { SIZES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface Category { _id: string; name: string; slug: string; }

const COLORS = [
  { name: 'Black',  hex: '#1a1a1a' },
  { name: 'White',  hex: '#f5f5f5' },
  { name: 'Navy',   hex: '#1b3a6b' },
  { name: 'Maroon', hex: '#800000' },
  { name: 'Olive',  hex: '#6b7a3c' },
  { name: 'Beige',  hex: '#d4b896' },
  { name: 'Pink',   hex: '#f4a7b9' },
  { name: 'Blue',   hex: '#4a90d9' },
  { name: 'Green',  hex: '#3a7d44' },
  { name: 'Brown',  hex: '#8b5e3c' },
];

interface ProductFiltersProps {
  searchParams: Record<string, string | undefined>;
}

export default function ProductFilters({ searchParams }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/categories`)
      .then((r) => r.json())
      .then((d) => setCategories(d.data || []))
      .catch(() => {});
  }, []);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    if (value === null) params.delete(key);
    else params.set(key, value);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAll = () => router.push(pathname);

  // Active filter chips data
  const activeFilters: { key: string; label: string }[] = [];
  if (searchParams.category) {
    const cat = categories.find((c) => c._id === searchParams.category);
    if (cat) activeFilters.push({ key: 'category', label: cat.name });
  }
  if (searchParams.size) activeFilters.push({ key: 'size', label: `Size: ${searchParams.size}` });
  if (searchParams.color) activeFilters.push({ key: 'color', label: `Color: ${searchParams.color}` });
  if (searchParams.minPrice || searchParams.maxPrice) {
    const label = searchParams.minPrice && searchParams.maxPrice
      ? `Rs. ${Number(searchParams.minPrice).toLocaleString()} – ${Number(searchParams.maxPrice).toLocaleString()}`
      : searchParams.minPrice
      ? `Rs. ${Number(searchParams.minPrice).toLocaleString()}+`
      : `Under Rs. ${Number(searchParams.maxPrice).toLocaleString()}`;
    activeFilters.push({ key: 'price', label });
  }

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    if (key === 'price') { params.delete('minPrice'); params.delete('maxPrice'); }
    else params.delete(key);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const activeCount = [searchParams.category, searchParams.size, searchParams.color, searchParams.minPrice, searchParams.maxPrice].filter(Boolean).length;

  const filtersJSX = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-charcoal">
          Filters{' '}
          {activeCount > 0 && (
            <span className="ml-1 text-xs bg-sand text-white rounded-full px-1.5 py-0.5">{activeCount}</span>
          )}
        </h3>
        {activeCount > 0 && (
          <button onClick={clearAll} className="text-xs text-sand hover:underline">
            Clear all
          </button>
        )}
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((f) => (
            <span
              key={f.key}
              className="flex items-center gap-1.5 px-3 py-1 bg-sand-50 text-charcoal text-xs rounded-full border border-sand-200"
            >
              {f.label}
              <button onClick={() => removeFilter(f.key)} aria-label={`Remove ${f.label} filter`}>
                <X size={11} className="text-charcoal-muted hover:text-charcoal" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Category */}
      {categories.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-charcoal mb-3">Category</h4>
          <div className="space-y-1">
            <button
              onClick={() => updateFilter('category', null)}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg text-sm transition-all',
                !searchParams.category ? 'bg-sand text-white font-medium' : 'text-charcoal hover:bg-sand-50'
              )}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => updateFilter('category', searchParams.category === cat._id ? null : cat._id)}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg text-sm transition-all',
                  searchParams.category === cat._id ? 'bg-sand text-white font-medium' : 'text-charcoal hover:bg-sand-50'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size */}
      <div>
        <h4 className="text-sm font-medium text-charcoal mb-3">Size</h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => updateFilter('size', searchParams.size === size ? null : size)}
              className={cn(
                'px-3 py-1.5 rounded-lg border text-xs font-medium transition-all',
                searchParams.size === size
                  ? 'bg-charcoal text-cream border-charcoal'
                  : 'border-sand-200 text-charcoal hover:border-charcoal'
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <h4 className="text-sm font-medium text-charcoal mb-3">
          Color
          {searchParams.color && (
            <span className="ml-2 text-xs font-normal text-charcoal-muted">{searchParams.color}</span>
          )}
        </h4>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color.name}
              title={color.name}
              onClick={() => updateFilter('color', searchParams.color === color.name ? null : color.name)}
              className={cn(
                'w-8 h-8 rounded-full border-2 transition-all hover:scale-110',
                searchParams.color === color.name ? 'border-charcoal scale-110 shadow-md' : 'border-sand-100'
              )}
              style={{ backgroundColor: color.hex }}
              aria-label={color.name}
            />
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h4 className="text-sm font-medium text-charcoal mb-3">Price Range (Rs.)</h4>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={searchParams.minPrice}
            onBlur={(e) => updateFilter('minPrice', e.target.value || null)}
            className="input-field text-sm py-2"
          />
          <input
            type="number"
            placeholder="Max"
            defaultValue={searchParams.maxPrice}
            onBlur={(e) => updateFilter('maxPrice', e.target.value || null)}
            className="input-field text-sm py-2"
          />
        </div>
      </div>

      {/* Quick price presets */}
      <div className="flex flex-wrap gap-2">
        {[
          ['Under Rs. 5,000', '0', '5000'],
          ['Rs. 5–10k', '5000', '10000'],
          ['Rs. 10k+', '10000', ''],
        ].map(([label, min, max]) => (
          <button
            key={label}
            onClick={() => {
              const params = new URLSearchParams(searchParams as Record<string, string>);
              if (min) params.set('minPrice', min); else params.delete('minPrice');
              if (max) params.set('maxPrice', max); else params.delete('maxPrice');
              params.delete('page');
              router.push(`${pathname}?${params.toString()}`);
            }}
            className="px-3 py-1.5 rounded-lg border border-sand-200 text-xs text-charcoal hover:border-charcoal transition-all"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile: toggle button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="flex items-center gap-2 px-4 py-2.5 border border-sand-200 rounded-xl text-sm font-medium text-charcoal w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal size={15} /> Filters {activeCount > 0 && `(${activeCount})`}
          </span>
          <ChevronDown size={15} className={cn('transition-transform', mobileOpen && 'rotate-180')} />
        </button>
        {mobileOpen && (
          <div className="mt-3 p-4 border border-sand-100 rounded-xl bg-white">
            {filtersJSX}
          </div>
        )}
      </div>

      {/* Desktop: always visible */}
      <div className="hidden lg:block">{filtersJSX}</div>
    </>
  );
}
