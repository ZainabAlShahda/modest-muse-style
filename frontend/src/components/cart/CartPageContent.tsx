'use client';

import { useCart } from '@/context/CartContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export default function CartPageContent() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <ShoppingBag size={48} className="mx-auto text-sand-200 mb-4" />
        <h2 className="font-serif text-2xl text-charcoal">Your cart is empty</h2>
        <p className="mt-3 text-charcoal-muted">Looks like you haven't added anything yet.</p>
        <Link href="/shop" className="btn-primary mt-6 inline-block">Browse the Collection</Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-3">
        {items.map((item) => <CartItem key={item.sku} item={item} />)}
      </div>
      <div className="lg:col-span-1">
        <div className="card p-6 space-y-6 sticky top-24">
          <h2 className="font-serif text-xl text-charcoal">Order Summary</h2>
          <CartSummary />
          <Link href="/checkout" className="btn-primary w-full text-center block py-4">Proceed to Checkout</Link>
          <Link href="/shop" className="btn-secondary w-full text-center block text-sm">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
