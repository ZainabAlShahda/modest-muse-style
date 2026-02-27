'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '@/types/product';
import { formatPrice, getDiscountPercent, cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import QuickView from './QuickView';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const [quickView, setQuickView] = useState(false);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const wishlisted = isWishlisted(product._id);
  const discount = product.compareAtPrice ? getDiscountPercent(product.price, product.compareAtPrice) : 0;
  const image = product.images[0];
  const isNew = product.tags?.includes('new') || product.tags?.includes('new-in');
  const isSoldOut = product.totalStock === 0;
  const isLowStock = !isSoldOut && product.totalStock > 0 && product.totalStock <= 5;

  // Unique sizes with stock
  const availableSizes = [...new Set(
    product.variants.filter((v) => v.stock > 0).map((v) => v.size)
  )];

  // Unique colors (for swatches)
  const uniqueColors = [...new Map(
    product.variants.map((v) => [v.color, { name: v.color, hex: v.colorHex }])
  ).values()].slice(0, 4);

  const handleQuickAdd = (size: string) => {
    const variant = product.variants.find((v) => v.size === size && v.stock > 0);
    if (!variant) return;
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
    setShowSizes(false);
  };

  return (
    <article
      className="group relative"
      onMouseLeave={() => setShowSizes(false)}
    >
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-product overflow-hidden rounded-xl bg-sand-50">
          {image && !imgError ? (
            <Image
              src={image.url}
              alt={image.alt || product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-sand-300 text-xs text-center px-2">{product.name}</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isNew && (
              <span className="bg-sand text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">New In</span>
            )}
            {discount > 0 && (
              <span className="bg-blush text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">-{discount}%</span>
            )}
            {isLowStock && (
              <span className="bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">Only {product.totalStock} left!</span>
            )}
          </div>

          {/* Sold out overlay */}
          {isSoldOut && (
            <div className="absolute inset-0 bg-cream/70 flex items-center justify-center rounded-xl">
              <span className="font-medium text-sm text-charcoal-muted">Sold Out</span>
            </div>
          )}

          {/* Quick Add — appears on hover */}
          {!isSoldOut && (
            <div className={cn(
              'absolute bottom-0 left-0 right-0 transition-all duration-200',
              showSizes ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0'
            )}>
              {showSizes ? (
                /* Size picker */
                <div className="bg-white/95 backdrop-blur-sm px-3 pt-2 pb-3 rounded-b-xl">
                  <p className="text-[10px] text-charcoal-muted uppercase tracking-wider mb-2">Select Size</p>
                  <div className="flex flex-wrap gap-1.5">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={(e) => { e.preventDefault(); handleQuickAdd(size); }}
                        className="px-2.5 py-1 text-xs font-medium border border-sand-200 rounded-lg hover:bg-charcoal hover:text-white hover:border-charcoal transition-all"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Quick Add button */
                <button
                  onClick={(e) => { e.preventDefault(); setShowSizes(true); }}
                  className="w-full bg-charcoal text-cream text-xs font-semibold py-2.5 flex items-center justify-center gap-1.5 hover:bg-sand transition-colors rounded-b-xl"
                >
                  <ShoppingBag size={13} />
                  Quick Add
                </button>
              )}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-3 space-y-1">
          <p className="text-[11px] text-charcoal-muted uppercase tracking-wider">{product.category?.name}</p>
          <h3 className="font-medium text-charcoal text-sm leading-snug group-hover:text-sand transition-colors">{product.name}</h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-charcoal text-sm">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-xs text-charcoal-muted line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>
          {/* Color swatches */}
          {uniqueColors.length > 0 && (
            <div className="flex items-center gap-1 pt-0.5">
              {uniqueColors.map((c) => (
                <span
                  key={c.name}
                  title={c.name}
                  className="w-3.5 h-3.5 rounded-full border border-sand-200 shrink-0"
                  style={c.hex ? { backgroundColor: c.hex } : { backgroundColor: '#ccc' }}
                />
              ))}
              {product.variants.length > 4 && (
                <span className="text-[10px] text-charcoal-muted">+{product.variants.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Wishlist + Quick View buttons */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5">
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product._id, product.name); }}
          className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm transition-all hover:scale-110"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={14} className={wishlisted ? 'fill-blush text-blush' : 'text-charcoal-muted'} />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); setQuickView(true); }}
          className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
          aria-label="Quick view"
        >
          <Eye size={14} className="text-charcoal-muted" />
        </button>
      </div>

      {/* Quick View Modal */}
      {quickView && <QuickView product={product} onClose={() => setQuickView(false)} />}
    </article>
  );
}
