const testimonials = [
  { name: 'Fatima A.', location: 'Dubai', rating: 5, body: "The quality is exceptional — the fabric drapes beautifully and the fit is perfect. I've received so many compliments." },
  { name: 'Nadia K.', location: 'London', rating: 5, body: "Finally a modest brand that doesn't compromise on style. The designs are elegant and the shipping was fast!" },
  { name: 'Mariam H.', location: 'Toronto', rating: 5, body: 'I ordered three abayas and every single one exceeded my expectations. Modest Muse Style is now my go-to.' },
];

export default function Testimonials() {
  return (
    <section className="container-wide py-24">
      <div className="text-center mb-14">
        <span className="text-xs font-medium tracking-widest uppercase text-sand">What She Says</span>
        <h2 className="font-serif text-4xl md:text-5xl text-charcoal mt-2">Women Who Wear Muse</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.name} className="card p-8">
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, i) => (
                <span key={i} className="text-sand text-lg">★</span>
              ))}
            </div>
            <p className="text-charcoal-muted leading-relaxed text-sm italic">"{t.body}"</p>
            <div className="mt-6 border-t border-sand-100 pt-5">
              <p className="font-medium text-charcoal text-sm">{t.name}</p>
              <p className="text-xs text-charcoal-muted">{t.location}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
