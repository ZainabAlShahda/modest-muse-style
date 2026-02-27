import Link from 'next/link';

export default function PromoBanner() {
  return (
    <section className="bg-charcoal py-16 my-8">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-sand">Limited Time</span>
            <h2 className="font-serif text-4xl md:text-5xl text-cream mt-2 leading-tight">
              Season Sale —<br />
              <em className="text-blush">Up to 40% Off</em>
            </h2>
            <p className="mt-4 text-cream/65 text-sm leading-relaxed max-w-sm">
              Shop our curated sale selection — formal sets, casual lawn, and more. Stocks are limited, so grab your favourites before they're gone.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link
              href="/shop?sort=price-asc"
              className="bg-sand text-cream font-semibold px-8 py-4 rounded-xl hover:bg-sage transition-colors text-sm text-center"
            >
              Shop Sale
            </Link>
            <Link
              href="/shop?sort=newest"
              className="border border-cream/30 text-cream font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-sm text-center"
            >
              New Arrivals
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-6 mt-12 pt-10 border-t border-white/10">
          {[
            { value: '500+', label: 'Products' },
            { value: '10k+', label: 'Happy Customers' },
            { value: '4.9★', label: 'Average Rating' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-3xl text-cream">{stat.value}</p>
              <p className="text-xs text-cream/50 mt-1 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
