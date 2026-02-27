'use client';

import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { axiosInstance } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

const STATUS_META: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending:    { label: 'Order Placed',  color: 'text-amber-600',  icon: <Clock size={18} /> },
  processing: { label: 'Processing',   color: 'text-blue-600',   icon: <Package size={18} /> },
  shipped:    { label: 'Shipped',      color: 'text-indigo-600', icon: <Truck size={18} /> },
  delivered:  { label: 'Delivered',    color: 'text-green-600',  icon: <CheckCircle size={18} /> },
  cancelled:  { label: 'Cancelled',    color: 'text-red-500',    icon: <XCircle size={18} /> },
  refunded:   { label: 'Refunded',     color: 'text-red-500',    icon: <XCircle size={18} /> },
};

interface Order {
  orderNumber: string;
  status: string;
  isPaid: boolean;
  items: { name: string; image?: string; price: number; quantity: number; size?: string; color?: string }[];
  shippingAddress: { fullName: string; street: string; city: string; state?: string; postalCode: string; country: string };
  totalPrice: number;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  paymentMethod: string;
  createdAt: string;
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOrder(null);
    if (!orderNumber.trim() || !email.trim()) {
      setError('Please enter both your order number and email address.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/orders/track', {
        orderNumber: orderNumber.trim(),
        email: email.trim(),
      });
      setOrder(data.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Order not found. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentStepIdx = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <div className="container-wide py-12 max-w-3xl mx-auto">
      <Breadcrumb items={[{ label: 'Track Order' }]} />
      <div className="mt-8 mb-10">
        <h1 className="font-serif text-4xl text-charcoal">Track Your Order</h1>
        <p className="mt-2 text-charcoal-muted">Enter your order number and email to see real-time status.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Order Number</label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. MMS-00001"
              className="input-field w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="input-field w-full"
              required
            />
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            ⚠ {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-60"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <><Search size={16} /> Track Order</>
          )}
        </button>
      </form>

      {/* Result */}
      {order && (
        <div className="mt-8 space-y-6">
          {/* Status header */}
          <div className="card p-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs text-charcoal-muted uppercase tracking-wider">Order</p>
                <h2 className="font-serif text-2xl text-charcoal mt-1">{order.orderNumber}</h2>
                <p className="text-xs text-charcoal-muted mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className={`flex items-center gap-2 font-semibold text-sm ${STATUS_META[order.status]?.color || 'text-charcoal'}`}>
                {STATUS_META[order.status]?.icon}
                {STATUS_META[order.status]?.label || order.status}
              </div>
            </div>

            {/* Progress bar (for non-cancelled orders) */}
            {!['cancelled', 'refunded'].includes(order.status) && (
              <div className="mt-8">
                <div className="flex items-center">
                  {STATUS_STEPS.map((step, i) => (
                    <div key={step} className="flex items-center flex-1 last:flex-none">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                        i <= currentStepIdx ? 'bg-sand text-white' : 'bg-sand-100 text-charcoal-muted'
                      }`}>
                        {i < currentStepIdx ? '✓' : i + 1}
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <div className={`h-0.5 w-full transition-colors ${i < currentStepIdx ? 'bg-sand' : 'bg-sand-100'}`} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex mt-2">
                  {STATUS_STEPS.map((step) => (
                    <div key={step} className="flex-1 last:flex-none">
                      <p className="text-[10px] text-charcoal-muted capitalize">{STATUS_META[step]?.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="card p-6">
            <h3 className="font-medium text-charcoal mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-sand-50 overflow-hidden shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} width={56} height={56} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal truncate">{item.name}</p>
                    <p className="text-xs text-charcoal-muted mt-0.5">
                      {[item.size, item.color].filter(Boolean).join(' · ')} · Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-charcoal shrink-0">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            {/* Order totals */}
            <div className="mt-6 pt-5 border-t border-sand-100 space-y-2">
              <div className="flex justify-between text-sm text-charcoal-muted">
                <span>Subtotal</span>
                <span>{formatPrice(order.itemsPrice)}</span>
              </div>
              <div className="flex justify-between text-sm text-charcoal-muted">
                <span>Shipping</span>
                <span>{order.shippingPrice === 0 ? 'Free' : formatPrice(order.shippingPrice)}</span>
              </div>
              <div className="flex justify-between text-sm text-charcoal-muted">
                <span>Tax</span>
                <span>{formatPrice(order.taxPrice)}</span>
              </div>
              <div className="flex justify-between font-semibold text-charcoal pt-2 border-t border-sand-100">
                <span>Total</span>
                <span>{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="card p-6">
            <h3 className="font-medium text-charcoal mb-3">Shipping Address</h3>
            <p className="text-sm text-charcoal">{order.shippingAddress.fullName}</p>
            <p className="text-sm text-charcoal-muted mt-1">
              {order.shippingAddress.street}, {order.shippingAddress.city}
              {order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ''}
              {' '}{order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${order.isPaid ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                {order.isPaid ? 'Payment Confirmed' : 'Awaiting Payment'}
              </span>
              <span className="text-xs text-charcoal-muted capitalize">{order.paymentMethod.replace(/_/g, ' ')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
