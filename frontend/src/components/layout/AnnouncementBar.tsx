'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

const MESSAGES = [
  '🌿 Free shipping on orders over Rs. 5,000',
  '✨ New Season Collection — Shop Now',
  '↩ Easy Returns within 7 days',
  '🎁 Use code MUSE10 for 10% off your first order',
];

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="relative bg-charcoal text-cream overflow-hidden h-9 flex items-center">
      {/* Scrolling marquee */}
      <div className="flex w-full overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap gap-16 pr-16">
          {[...MESSAGES, ...MESSAGES].map((msg, i) => (
            <span key={i} className="text-xs font-medium tracking-wide shrink-0">
              {msg}
            </span>
          ))}
        </div>
      </div>

      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-cream/50 hover:text-cream transition-colors z-10"
        aria-label="Dismiss announcement"
      >
        <X size={13} />
      </button>
    </div>
  );
}
