'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SLIDES = [
  {
    tag: '🌿 New Season Collection',
    headline: ['Dressed in', 'Quiet', 'Elegance.'],
    sub: 'Modest fashion that moves with you. Thoughtfully designed, beautifully crafted — for the woman who wears her values with grace.',
    cta: { label: 'Shop the Collection', href: '/shop' },
    ctaSecondary: { label: 'Our Story', href: '/about' },
    badges: [
      { label: '100% Natural Fabrics', icon: '🌿' },
      { label: 'Free Returns',          icon: '↩' },
      { label: 'Ships Worldwide',        icon: '✈' },
    ],
    bg: 'bg-cream',
    accent: 'bg-sand-50',
  },
  {
    tag: '✨ Summer Lawn 2025',
    headline: ['Breathe in', 'Summer', 'Beauty.'],
    sub: 'Light, airy lawn fabrics in vibrant prints — perfect for every occasion from casual days to festive gatherings.',
    cta: { label: 'Shop Lawn Collection', href: '/shop?category=lawn' },
    ctaSecondary: { label: 'View Lookbook', href: '/blog' },
    badges: [
      { label: 'Premium Lawn Fabric', icon: '🪡' },
      { label: 'Vibrant Prints',       icon: '🎨' },
      { label: 'Unstitched & Ready',   icon: '✂️' },
    ],
    bg: 'bg-sage-50',
    accent: 'bg-cream',
  },
  {
    tag: '🎁 Up to 40% Off — Sale',
    headline: ['Luxury at', 'Every', 'Price Point.'],
    sub: 'Timeless formal and festive wear, now at exceptional prices. Limited stock — shop before it\'s gone.',
    cta: { label: 'Shop the Sale', href: '/shop?sort=price-asc' },
    ctaSecondary: { label: 'New Arrivals', href: '/shop?sort=newest' },
    badges: [
      { label: 'Up to 40% Off',    icon: '🏷️' },
      { label: 'Limited Stock',    icon: '⚡' },
      { label: 'COD Available',    icon: '📦' },
    ],
    bg: 'bg-blush-50',
    accent: 'bg-sand-50',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length), []);
  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5500);
    return () => clearInterval(timer);
  }, [paused, next]);

  const slide = SLIDES[current];

  return (
    <section
      className={cn('relative min-h-screen flex items-center overflow-hidden pt-28 transition-colors duration-700', slide.bg)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background shape */}
      <div className={cn('absolute top-0 right-0 w-[55%] h-full rounded-l-[5rem] transition-colors duration-700', slide.accent)} />
      <div className="absolute top-1/4 right-[10%] w-80 h-80 bg-sage-50 rounded-full opacity-30 blur-3xl" />
      <div className="absolute bottom-20 left-8 w-48 h-48 bg-blush-50 rounded-full opacity-40 blur-2xl" />

      <div className="container-wide relative z-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Copy */}
          <div key={current} className="animate-slide-up order-2 lg:order-1">
            <span className="tag-accent mb-6 inline-block">{slide.tag}</span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-display-lg text-charcoal leading-tight text-balance">
              {slide.headline[0]}
              <br />
              <em className="text-sand">{slide.headline[1]}</em>{' '}
              <span className="relative inline-block">
                {slide.headline[2]}
                <svg className="absolute -bottom-3 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M2 6 C 50 2, 150 2, 198 6" stroke="#2D5A1B" strokeWidth="2.5" strokeLinecap="round" opacity="0.35"/>
                </svg>
              </span>
            </h1>
            <p className="mt-10 text-lg text-charcoal-muted leading-relaxed max-w-lg">{slide.sub}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href={slide.cta.href} className="btn-primary text-base px-8 py-4 shadow-md">
                {slide.cta.label}
              </Link>
              <Link href={slide.ctaSecondary.href} className="btn-secondary text-base px-8 py-4">
                {slide.ctaSecondary.label}
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap gap-6">
              {slide.badges.map((b) => (
                <div key={b.label} className="flex items-center gap-2">
                  <span className="text-base">{b.icon}</span>
                  <span className="text-xs font-medium text-charcoal-muted">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative order-1 lg:order-2 max-w-sm mx-auto lg:mx-0 lg:ml-auto">
            <div className="relative aspect-[3/4] w-full rounded-[3.5rem] overflow-hidden bg-sand-100 shadow-card-hover">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8">
                <Image
                  src="/logo.png"
                  alt="Modest Muse Style"
                  width={140}
                  height={120}
                  className="w-32 h-auto object-contain opacity-20"
                />
                <p className="text-sand-400 text-xs font-medium text-center">
                  Hero image — 3:4 ratio<br />
                  Replace with a product photo
                </p>
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute -left-8 top-1/4 card px-4 py-3 shadow-card-hover bg-white">
              <p className="text-xs font-semibold text-charcoal flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sand inline-block" />
                Premium Fabrics
              </p>
              <p className="text-[11px] text-charcoal-muted mt-0.5">100% natural fibres</p>
            </div>
            <div className="absolute -right-8 bottom-1/4 card px-4 py-3 shadow-card-hover bg-white">
              <p className="text-xs font-semibold text-charcoal flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sage inline-block" />
                Free Shipping
              </p>
              <p className="text-[11px] text-charcoal-muted mt-0.5">On orders over Rs. 5,000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel controls */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-card-hover hover:bg-white transition-colors z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} className="text-charcoal" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-card-hover hover:bg-white transition-colors z-10"
        aria-label="Next slide"
      >
        <ChevronRight size={20} className="text-charcoal" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              'rounded-full transition-all duration-300',
              i === current ? 'w-6 h-2 bg-sand' : 'w-2 h-2 bg-charcoal/25 hover:bg-charcoal/50'
            )}
          />
        ))}
      </div>
    </section>
  );
}
