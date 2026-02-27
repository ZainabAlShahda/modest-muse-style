'use client';

import { useEffect, useState } from 'react';
import { X, ShoppingBag, Heart, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types/product';
import { formatPrice, getDiscountPercent, cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import toast from 'react-hot-toast';

interface QuickViewProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickView({ product, onClose }: QuickViewProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [imgIdx, setImgIdx] = useState(0);
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  useEffect(() => {
    if (!product) return;
    setSelectedSize('');
    setSelectedColor('');
    setImgIdx(0);
  }, [product]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!product) return null;

  const discount = product.compareAtPrice ? getDiscountPercent(product.price, product.compareAtPrice) : 0;
  const wishlisted = isWishlisted(product._id);

  const uniqueSizes = [...new Set(product.variants.filter((v) => v.stock > 0).map((v) => v.size))];
  const uniqueColors = [...new Map(product.variants.map((v) => [v.color, { name: v.color, hex: v.colorHex }])).values()];

  const handleAddToCart = () => {
    if (uniqueSizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    const variant = product.variants.find(
      (v) => (!selectedSize || v.size === selectedSize) && (!selectedColor || v.color === selectedColor) && v.stock > 0
    );
    if (!variant) { toast.error('Selected variant unavailable'); return; }
    addItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || '',
      size: variant.size,
      color: variant.color,
      sku: variant.sku,
      quantity: 1,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-sand-50 flex items-center justify-center text-charcoal-muted hover:text-charcoal transition-colors"
          aria-label="Close quick view"
        >
          <X size={16} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-[3/4] bg-sand-50 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none overflow-hidden">
            {product.images[imgIdx]?.url ? (
              <Image
                src={product.images[imgIdx].url}
                alt={product.images[imgIdx].alt || product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sand-300 text-sm">{product.name}</div>
            )}

            {/* Thumbnail strip */}
            {product.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {product.images.slice(0, 5).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={cn('w-1.5 h-1.5 rounded-full transition-all', i === imgIdx ? 'bg-white w-4' : 'bg-white/60')}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-6 flex flex-col">
            <p className="text-xs text-charcoal-muted uppercase tracking-wider">{product.category?.name}</p>
            <h2 className="font-serif text-2xl text-charcoal mt-1 leading-snug">{product.name}</h2>

            {/* Rating */}
            {product.ratingsCount > 0 && (
              <div className="flex items-center gap-1.5 mt-2">
                <div className="flex">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} size={12} className={s <= Math.round(product.ratingsAverage) ? 'fill-blush text-blush' : 'text-sand-200'} />
                  ))}
                </div>
                <span className="text-xs text-charcoal-muted">({product.ratingsCount})</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mt-3">
              <span className="font-semibold text-xl text-charcoal">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-sm text-charcoal-muted line-through">{formatPrice(product.compareAtPrice)}</span>
              )}
              {discount > 0 && (
                <span className="text-xs font-semibold bg-blush-50 text-blush px-2 py-0.5 rounded-full">-{discount}%</span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-charcoal-muted mt-3 leading-relaxed line-clamp-3">{product.description}</p>
            )}

            {/* Colors */}
            {uniqueColors.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-medium text-charcoal mb-2">Colour: <span className="text-charcoal-muted font-normal">{selectedColor || 'Select'}</span></p>
                <div className="flex gap-2 flex-wrap">
                  {uniqueColors.map((c) => (
                    <button
                      key={c.name}
                      title={c.name}
                      onClick={() => setSelectedColor(c.name === selectedColor ? '' : c.name)}
                      className={cn(
                        'w-7 h-7 rounded-full border-2 transition-all',
                        selectedColor === c.name ? 'border-charcoal scale-110' : 'border-sand-200'
                      )}
                      style={c.hex ? { backgroundColor: c.hex } : { backgroundColor: '#ccc' }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {uniqueSizes.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-medium text-charcoal mb-2">Size: <span className="text-charcoal-muted font-normal">{selectedSize || 'Select'}</span></p>
                <div className="flex gap-2 flex-wrap">
                  {uniqueSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size === selectedSize ? '' : size)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg border text-xs font-medium transition-all',
                        selectedSize === size
                          ? 'bg-charcoal text-cream border-charcoal'
                          : 'border-sand-200 text-charcoal hover:border-charcoal'
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 text-sm"
              >
                <ShoppingBag size={16} /> Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist(product._id, product.name)}
                className={cn(
                  'w-11 h-11 rounded-xl border flex items-center justify-center transition-all',
                  wishlisted ? 'bg-blush-50 border-blush text-blush' : 'border-sand-200 text-charcoal-muted hover:border-charcoal'
                )}
                aria-label="Wishlist"
              >
                <Heart size={16} className={wishlisted ? 'fill-blush' : ''} />
              </button>
            </div>

            {/* View full details link */}
            <Link
              href={`/shop/${product.slug}`}
              onClick={onClose}
              className="mt-4 text-xs text-center text-sand hover:underline"
            >
              View full product details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
