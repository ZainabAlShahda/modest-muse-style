'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProductImage } from '@/types/product';

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="aspect-product bg-sand-50 rounded-2xl flex items-center justify-center"><span className="text-sand-300 text-sm">No image</span></div>;
  }

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-product rounded-2xl overflow-hidden bg-sand-50 group">
        <Image
          src={images[activeIndex].url}
          alt={images[activeIndex].alt || productName}
          fill
          className="object-cover transition-all duration-500"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />

        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setActiveIndex((i) => (i + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-16 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${idx === activeIndex ? 'border-charcoal' : 'border-transparent hover:border-sand-300'}`}
            >
              <Image src={img.url} alt={img.alt || `${productName} ${idx + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
