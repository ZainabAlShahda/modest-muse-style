'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    toast.success('Thank you for subscribing!');
  };

  return (
    <section className="bg-sand-50 py-20">
      <div className="container-wide max-w-2xl mx-auto text-center">
        <span className="text-xs font-medium tracking-widest uppercase text-sand">Join the Circle</span>
        <h2 className="font-serif text-4xl md:text-5xl text-charcoal mt-3">Stay in the Know</h2>
        <p className="mt-4 text-charcoal-muted leading-relaxed">
          New arrivals, style stories, and exclusive offers — straight to your inbox.
        </p>

        {submitted ? (
          <p className="mt-8 text-sand font-medium">You're on the list! Welcome to the Muse community.</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="input-field flex-1"
              required
            />
            <button type="submit" className="btn-primary whitespace-nowrap">Subscribe</button>
          </form>
        )}

        <p className="mt-4 text-xs text-charcoal-muted">No spam, ever. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}
