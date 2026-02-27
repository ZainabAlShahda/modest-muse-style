'use client';

import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartSummary() {
  const { subtotal } = useCart();
  const shipping = subtotal >= 75 ? 0 : 8.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between text-charcoal-muted">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className="flex justify-between text-charcoal-muted">
        <span>Shipping</span>
        <span>{shipping === 0 ? <span className="text-sage">Free</span> : formatPrice(shipping)}</span>
      </div>
      <div className="flex justify-between text-charcoal-muted">
        <span>Est. Tax</span>
        <span>{formatPrice(tax)}</span>
      </div>
      <div className="border-t border-sand-100 pt-2 flex justify-between font-semibold text-charcoal text-base">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
      {subtotal < 75 && shipping > 0 && (
        <p className="text-xs text-sage text-center pt-1">
          Add {formatPrice(75 - subtotal)} more for free shipping!
        </p>
      )}
    </div>
  );
}
