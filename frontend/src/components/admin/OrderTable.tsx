'use client';

import useSWR from 'swr';
import { apiClient } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrderTable() {
  const { data, isLoading } = useSWR('/orders?limit=20', apiClient);
  const orders = data?.data || [];

  if (isLoading) {
    return <div className="card p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>;
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sand-100 bg-cream">
              <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-muted font-medium">Order</th>
              <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-muted font-medium">Customer</th>
              <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-muted font-medium">Date</th>
              <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-muted font-medium">Total</th>
              <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-muted font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-100">
            {orders.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-charcoal-muted">No orders yet.</td></tr>
            ) : orders.map((o: any) => (
              <tr key={o._id} className="hover:bg-cream/50 transition-colors">
                <td className="px-6 py-4 font-medium text-charcoal">{o.orderNumber}</td>
                <td className="px-6 py-4 text-charcoal-muted">{o.user?.name || o.guestEmail || '–'}</td>
                <td className="px-6 py-4 text-charcoal-muted">{formatDate(o.createdAt)}</td>
                <td className="px-6 py-4 font-medium text-charcoal">{formatPrice(o.totalPrice)}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-600'}`}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
