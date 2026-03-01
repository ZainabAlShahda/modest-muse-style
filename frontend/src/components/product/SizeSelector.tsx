import type { ProductVariant } from '@/types/product';

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSelect: (size: string) => void;
  variants: ProductVariant[];
  selectedColor: string;
}

export default function SizeSelector({ sizes, selectedSize, onSelect, variants, selectedColor }: SizeSelectorProps) {
  const isOutOfStock = (size: string) => {
    const matches = variants.filter((v) => v.size === size && (!selectedColor || v.color === selectedColor));
    return matches.every((v) => v.stock === 0);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const oos = isOutOfStock(size);
          return (
            <button
              key={size}
              onClick={() => !oos && onSelect(size)}
              disabled={oos}
              className={`w-12 h-12 rounded-xl border text-sm font-medium transition-all ${
                selectedSize === size
                  ? 'bg-charcoal text-cream border-charcoal'
                  : oos
                  ? 'border-sand-100 text-charcoal-muted/40 cursor-not-allowed line-through'
                  : 'border-sand-200 text-charcoal hover:border-charcoal'
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
