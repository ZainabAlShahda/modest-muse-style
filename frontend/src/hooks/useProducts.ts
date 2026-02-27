import useSWR from 'swr';
import { apiClient } from '@/lib/api';
import type { Product } from '@/types/product';

interface UseProductsOptions {
  category?: string;
  size?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
}

interface ProductsResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function useProducts(options: UseProductsOptions = {}) {
  const params = new URLSearchParams();
  Object.entries(options).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      params.set(key, String(val));
    }
  });

  const key = `/products?${params.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<ProductsResponse>(key, apiClient);

  return {
    products: data?.data ?? [],
    meta: data?.meta ?? null,
    isLoading,
    error,
    mutate,
  };
}

export function useProduct(slug: string | null) {
  const { data, error, isLoading } = useSWR<{ data: Product }>(
    slug ? `/products/${slug}` : null,
    apiClient
  );

  return {
    product: data?.data ?? null,
    isLoading,
    error,
    notFound: !isLoading && !data && slug !== null,
  };
}
