'use client';

import useSWR from 'swr';
import { apiClient, axiosInstance } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';
import { Pencil, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface ProductTableProps {
  onEdit?: (product: any) => void;
}

export default function ProductTable({ onEdit }: ProductTableProps) {
  const { data, isLoading, mutate } = useSWR('/products?limit=50', apiClient);
  const products = data?.data || [];

  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await axiosInstance.delete(`/products/${slug}`);
      toast.success(`"${name}" deleted`);
      mutate();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  if (isLoading) {
    return (
      <div className="card p-6 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sand-100 bg-cream">
              <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-muted font-medium">Product</th>
              <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-muted font-medium">Category</th>
              <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-muted font-medium">Price</th>
              <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-muted font-medium">Stock</th>
              <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-muted font-medium">Status</th>
              <th className="text-right px-6 py-4 text-xs uppercase tracking-wider text-charcoal-muted font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-charcoal-muted">
                  No products yet. Click <strong>Add Product</strong> to get started.
                </td>
              </tr>
            ) : products.map((p: any) => {
              const totalStock = p.variants?.reduce((sum: number, v: any) => sum + v.stock, 0) ?? 0;
              return (
                <tr key={p._id} className="hover:bg-cream/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-charcoal">{p.name}</p>
                    <p className="text-xs text-charcoal-muted mt-0.5 font-mono">{p.slug}</p>
                  </td>
                  <td className="px-6 py-4 text-charcoal-muted">{p.category?.name || '–'}</td>
                  <td className="px-6 py-4 text-charcoal font-medium">
                    {formatPrice(p.price)}
                    {p.compareAtPrice && (
                      <span className="ml-2 text-xs text-charcoal-muted line-through">{formatPrice(p.compareAtPrice)}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={totalStock === 0 ? 'text-red-500 font-medium' : 'text-charcoal'}>
                      {totalStock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={p.isPublished ? 'sage' : 'charcoal'}>
                      {p.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                    {p.isFeatured && <Badge variant="sand" className="ml-1">Featured</Badge>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/shop/${p.slug}`}
                        target="_blank"
                        className="p-1.5 text-charcoal-muted hover:text-sand rounded-lg hover:bg-sand-50 transition-all"
                        title="Preview"
                      >
                        <Eye size={15} />
                      </Link>
                      {onEdit && (
                        <button
                          onClick={() => onEdit(p)}
                          className="p-1.5 text-charcoal-muted hover:text-charcoal rounded-lg hover:bg-sand-50 transition-all"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(p.slug, p.name)}
                        className="p-1.5 text-charcoal-muted hover:text-red-500 rounded-lg hover:bg-red-50 transition-all"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
