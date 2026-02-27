import type { Metadata } from 'next';
import Image from 'next/image';
import Breadcrumb from '@/components/layout/Breadcrumb';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn the story behind Modest Muse Style and our mission to make modest fashion beautiful.',
};

export default function AboutPage() {
  return (
    <div className="container-wide py-12">
      <Breadcrumb items={[{ label: 'About' }]} />

      <section className="mt-10 max-w-3xl">
        <h1 className="font-serif text-5xl text-charcoal leading-tight">
          Modest Fashion,<br />
          <em className="text-sand">Beautifully Told.</em>
        </h1>
        <p className="mt-6 text-lg text-charcoal-muted leading-relaxed">
          Modest Muse Style was born from a simple belief: that dressing modestly should never mean
          compromising on elegance, comfort, or self-expression. We design clothing that honours
          tradition while embracing the modern woman — her ambitions, her style, her story.
        </p>
      </section>

      <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: 'Our Mission', body: 'To empower women through beautifully crafted modest wear that blends timeless elegance with contemporary design.' },
          { title: 'Our Craft', body: 'Every piece is thoughtfully designed with premium fabrics, careful tailoring, and attention to coverage, comfort, and style.' },
          { title: 'Our Values', body: 'Inclusivity, sustainability, and slow fashion are at the heart of everything we do.' },
        ].map((item) => (
          <div key={item.title} className="card p-8">
            <h3 className="font-serif text-2xl text-charcoal mb-3">{item.title}</h3>
            <p className="text-charcoal-muted leading-relaxed">{item.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
