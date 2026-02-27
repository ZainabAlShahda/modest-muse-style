'use client';

import { useCart } from '@/context/CartContext';
import { X, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import Link from 'next/link';

export default function CartDrawer() {
  const { isOpen, closeCart, items, itemCount } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn('fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm transition-opacity duration-300', isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none')}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className={cn('fixed right-0 top-0 bottom-0 z-50 w-full sm:w-96 bg-cream shadow-2xl flex flex-col transition-transform duration-300', isOpen ? 'translate-x-0' : 'translate-x-full')}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sand-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-charcoal" />
            <span className="font-serif text-xl text-charcoal">Your Cart</span>
            {itemCount > 0 && <span className="text-sm text-charcoal-muted">({itemCount})</span>}
          </div>
          <button onClick={closeCart} className="p-1 text-charcoal hover:text-sand transition-colors" aria-label="Close cart">
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <ShoppingBag size={40} className="text-sand-200 mb-4" />
              <p className="font-serif text-xl text-charcoal">Your cart is empty</p>
              <p className="text-sm text-charcoal-muted mt-2">Discover our collection and find something you love.</p>
              <Link href="/shop" onClick={closeCart} className="btn-primary mt-6">Start Shopping</Link>
            </div>
          ) : (
            <div className="px-4 space-y-2">
              {items.map((item) => <CartItem key={item.sku} item={item} />)}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-sand-100 p-6 space-y-4">
            <CartSummary />
            <Link href="/checkout" onClick={closeCart} className="btn-primary w-full text-center block py-4 text-base">
              Proceed to Checkout
            </Link>
            <button onClick={closeCart} className="btn-secondary w-full text-sm">Continue Shopping</button>
          </div>
        )}
      </div>
    </>
  );
}
