import type { ProductVariant } from '@/types/product';
import { Check } from 'lucide-react';

interface ColorSelectorProps {
  colors: string[];
  variants: ProductVariant[];
  selected: string;
  onSelect: (color: string) => void;
}

export default function ColorSelector({ colors, variants, selected, onSelect }: ColorSelectorProps) {
  const getColorHex = (color: string) => {
    const variant = variants.find((v) => v.color === color);
    return variant?.colorHex;
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-medium text-charcoal">Color:</span>
        <span className="text-sm text-charcoal-muted">{selected || 'Select a color'}</span>
      </div>
      <div className="flex gap-3 flex-wrap">
        {colors.map((color) => {
          const hex = getColorHex(color);
          return (
            <button
              key={color}
              onClick={() => onSelect(color)}
              title={color}
              className={`relative w-9 h-9 rounded-full border-2 transition-all ${
                selected === color ? 'border-charcoal scale-110' : 'border-transparent hover:border-sand-300'
              }`}
              style={hex ? { backgroundColor: hex } : {}}
            >
              {!hex && <span className="text-[10px] text-charcoal-muted font-medium">{color.slice(0, 2)}</span>}
              {selected === color && hex && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Check size={14} className="text-white drop-shadow" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
