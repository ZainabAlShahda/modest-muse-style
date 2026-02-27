'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function useFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getFilter = (key: string) => searchParams.get(key) ?? undefined;

  const setFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.delete('page'); // reset pagination on filter change
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const setFilters = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') params.delete(key);
        else params.set(key, value);
      });
      params.delete('page');
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const currentFilters = {
    category: getFilter('category'),
    size: getFilter('size'),
    color: getFilter('color'),
    minPrice: getFilter('minPrice'),
    maxPrice: getFilter('maxPrice'),
    sort: getFilter('sort'),
    search: getFilter('search'),
    page: getFilter('page') ?? '1',
  };

  const hasActiveFilters = Object.values(currentFilters).some(
    (v, i) => v !== undefined && i < 6 // skip page
  );

  return { currentFilters, setFilter, setFilters, clearFilters, hasActiveFilters };
}
