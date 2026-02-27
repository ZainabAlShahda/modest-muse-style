'use client';

import { useState } from 'react';
import { ShoppingBag, Heart, Star, Ruler, Truck, RefreshCw } from 'lucide-react';
import type { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatPrice, getDiscountPercent } from '@/lib/utils';
import SizeSelector from './SizeSelector';
import ColorSelector from './ColorSelector';
import Badge from '@/components/ui/Badge';
import SizeGuideModal from './SizeGuideModal';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [error, setError] = useState('');
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const availableSizes = [...new Set(product.variants.map((v) => v.size))];
  const availableColors = [...new Set(product.variants.map((v) => v.color))];
  const discount = product.compareAtPrice ? getDiscountPercent(product.price, product.compareAtPrice) : 0;

  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const handleAddToCart = () => {
    if (!selectedSize) { setError('Please select a size'); return; }
    if (availableColors.length > 0 && !selectedColor) { setError('Please select a color'); return; }

    const variant = selectedVariant || product.variants.find((v) => v.size === selectedSize);
    if (!variant) { setError('Selected combination not available'); return; }
    if (variant.stock === 0) { setError('This variant is out of stock'); return; }

    setError('');
    addItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || '',
      size: selectedSize,
      color: selectedColor,
      sku: variant.sku,
      quantity: 1,
    });
  };

  return (
    <div className="space-y-6">
      {/* Category & badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs uppercase tracking-widest text-charcoal-muted">{product.category?.name}</span>
        {product.isFeatured && <Badge variant="sand">Featured</Badge>}
        {discount > 0 && <Badge variant="blush">-{discount}% off</Badge>}
      </div>

      {/* Name */}
      <h1 className="font-serif text-3xl md:text-4xl text-charcoal leading-snug">{product.name}</h1>

      {/* Rating */}
      {product.ratingsCount > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} className={i < Math.round(product.ratingsAverage) ? 'fill-sand text-sand' : 'text-sand-200'} />
            ))}
          </div>
          <span className="text-sm text-charcoal-muted">({product.ratingsCount} review{product.ratingsCount !== 1 ? 's' : ''})</span>
        </div>
      )}

      {/* Price */}
      <div className="flex items-end gap-3">
        <span className="text-3xl font-semibold text-charcoal">{formatPrice(product.price)}</span>
        {product.compareAtPrice && (
          <span className="text-lg text-charcoal-muted line-through">{formatPrice(product.compareAtPrice)}</span>
        )}
      </div>

      {/* Description */}
      <p className="text-charcoal-muted leading-relaxed">{product.description}</p>

      {/* Color selector */}
      {availableColors.length > 0 && (
        <ColorSelector colors={availableColors} variants={product.variants} selected={selectedColor} onSelect={setSelectedColor} />
      )}

      {/* Size selector + guide */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-charcoal">Size</span>
          <button
            onClick={() => setSizeGuideOpen(true)}
            className="flex items-center gap-1 text-xs text-sand hover:underline"
          >
            <Ruler size={12} /> Size Guide
          </button>
        </div>
        <SizeSelector sizes={availableSizes} selectedSize={selectedSize} onSelect={setSelectedSize} variants={product.variants} selectedColor={selectedColor} />
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* CTA */}
      <div className="flex gap-3 pt-2">
        <button onClick={handleAddToCart} className="btn-primary flex-1 flex items-center justify-center gap-2 py-4 text-base">
          <ShoppingBag size={18} />
          Add to Cart
        </button>
        <button
          onClick={() => toggleWishlist(product._id, product.name)}
          className="btn-secondary px-4"
          aria-label={isWishlisted(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={18} className={isWishlisted(product._id) ? 'fill-blush text-blush' : ''} />
        </button>
      </div>

      {/* Delivery & returns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div className="flex items-start gap-3 bg-sage-50 border border-sage-100 rounded-xl px-4 py-3">
          <Truck size={16} className="text-sage shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-charcoal">Estimated Delivery</p>
            <p className="text-xs text-charcoal-muted mt-0.5">3–7 business days nationwide</p>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-blush-50 border border-blush-100 rounded-xl px-4 py-3">
          <RefreshCw size={16} className="text-blush shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-charcoal">Easy Returns</p>
            <p className="text-xs text-charcoal-muted mt-0.5">7-day return & exchange policy</p>
          </div>
        </div>
      </div>

      {/* Fabric info */}
      {product.fabric && (
        <div className="border-t border-sand-100 pt-5 space-y-2">
          <p className="text-sm"><span className="font-medium text-charcoal">Fabric: </span><span className="text-charcoal-muted">{product.fabric}</span></p>
          {product.careInstructions?.length > 0 && (
            <div>
              <p className="text-sm font-medium text-charcoal mb-1">Care:</p>
              <ul className="text-sm text-charcoal-muted space-y-0.5">
                {product.careInstructions.map((i) => <li key={i}>• {i}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Size Guide Modal */}
      {sizeGuideOpen && <SizeGuideModal onClose={() => setSizeGuideOpen(false)} />}
    </div>
  );
}
