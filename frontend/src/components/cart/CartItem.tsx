'use client';

import Image from 'next/image';
import { Minus, Plus, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { CartItem as CartItemType } from '@/types/cart';
import { formatPrice } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCart();

  return (
    <div className="flex gap-4 p-3 bg-white rounded-xl">
      {/* Image */}
      <div className="relative w-16 h-20 shrink-0 rounded-lg overflow-hidden bg-sand-50">
        {item.image ? (
          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[10px] text-sand-300">No img</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div className="min-w-0 pr-2">
            <p className="font-medium text-charcoal text-sm leading-tight truncate">{item.name}</p>
            <p className="text-xs text-charcoal-muted mt-0.5">
              {item.size && `Size: ${item.size}`}{item.color && ` · ${item.color}`}
            </p>
          </div>
          <button onClick={() => removeItem(item.sku)} className="text-charcoal-muted hover:text-charcoal transition-colors shrink-0" aria-label="Remove item">
            <X size={14} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 border border-sand-200 rounded-lg">
            <button
              onClick={() => item.quantity > 1 ? updateQuantity(item.sku, item.quantity - 1) : removeItem(item.sku)}
              className="w-7 h-7 flex items-center justify-center text-charcoal hover:bg-sand-50 rounded-l-lg transition-colors"
            >
              <Minus size={12} />
            </button>
            <span className="w-6 text-center text-sm font-medium text-charcoal">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.sku, item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center text-charcoal hover:bg-sand-50 rounded-r-lg transition-colors"
            >
              <Plus size={12} />
            </button>
          </div>
          <span className="text-sm font-semibold text-charcoal">{formatPrice(item.price * item.quantity)}</span>
        </div>
      </div>
    </div>
  );
}
