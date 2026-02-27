'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useSWR from 'swr';
import { apiClient } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import Breadcrumb from '@/components/layout/Breadcrumb';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-sage-100 text-sage-700',
  cancelled: 'bg-red-100 text-red-800',
};

export default function MyOrdersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [user, isLoading, router]);

  const { data, isLoading: ordersLoading } = useSWR(user ? '/orders/my-orders' : null, apiClient);
  const orders = data?.data || [];

  return (
    <div className="container-wide py-12">
      <Breadcrumb items={[{ label: 'Account', href: '/account' }, { label: 'Orders' }]} />
      <h1 className="mt-6 font-serif text-3xl text-charcoal">Order History</h1>

      {ordersLoading ? (
        <div className="mt-12 flex justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-sand border-t-transparent rounded-full" />
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-20 text-center">
          <p className="text-charcoal-muted">You haven't placed any orders yet.</p>
          <Link href="/shop" className="btn-primary mt-6 inline-block">Start Shopping</Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order: any) => (
            <div key={order._id} className="card p-6">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <p className="font-medium text-charcoal">{order.orderNumber}</p>
                  <p className="text-sm text-charcoal-muted mt-1">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-charcoal">{formatPrice(order.totalPrice)}</p>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm text-charcoal-muted">
                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
