'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import CartSummary from '@/components/cart/CartSummary';

export default function OrderSummary() {
  const { items } = useCart();

  return (
    <div className="card p-6 space-y-5 sticky top-24">
      <h2 className="font-serif text-xl text-charcoal">Order Summary</h2>

      <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.sku} className="flex gap-3">
            <div className="relative w-14 h-18 shrink-0 rounded-lg overflow-hidden bg-sand-50">
              {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />}
              <span className="absolute -top-1.5 -right-1.5 bg-charcoal text-cream text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{item.quantity}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-charcoal leading-tight truncate">{item.name}</p>
              <p className="text-xs text-charcoal-muted">{item.size} · {item.color}</p>
              <p className="text-sm font-semibold text-charcoal mt-1">{formatPrice(item.price * item.quantity)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-sand-100 pt-4">
        <CartSummary />
      </div>
    </div>
  );
}
