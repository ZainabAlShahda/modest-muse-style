import Link from 'next/link';

export default function BrandStoryTeaser() {
  return (
    <section className="bg-charcoal text-cream py-24">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="aspect-[4/3] bg-white/5 rounded-3xl flex items-center justify-center">
            <p className="text-white/20 text-sm text-center">Brand Story Image<br />4:3 ratio</p>
          </div>
          <div>
            <span className="text-xs font-medium tracking-widest uppercase text-sand-300">Our Story</span>
            <h2 className="font-serif text-4xl md:text-5xl text-cream mt-4 leading-tight">
              Fashion That Honours
              <br />
              <em className="text-sand-300">Who You Are.</em>
            </h2>
            <p className="mt-6 text-cream/70 leading-relaxed">
              Modest Muse Style was born from a belief that modest dressing should be a celebration — of identity, of faith, of self. Every piece we make is a love letter to the women who wear it.
            </p>
            <Link href="/about" className="mt-8 inline-block btn-primary">
              Read Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
