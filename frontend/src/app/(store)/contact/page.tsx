import type { Metadata } from 'next';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { Mail, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the Modest Muse Style team.',
};

export default function ContactPage() {
  return (
    <div className="container-wide py-12">
      <Breadcrumb items={[{ label: 'Contact' }]} />

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h1 className="font-serif text-4xl text-charcoal">Get In Touch</h1>
          <p className="mt-4 text-charcoal-muted leading-relaxed">
            We'd love to hear from you. Whether you have a question about sizing, an order, or just want to say hello — we're here.
          </p>

          <div className="mt-10 space-y-6">
            {[
              { icon: Mail, label: 'Email', value: 'hello@modestmusestyle.com' },
              { icon: MapPin, label: 'Location', value: 'Ships Worldwide' },
              { icon: Clock, label: 'Response Time', value: 'Within 24 hours (Mon–Fri)' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-sand-50 flex items-center justify-center">
                  <Icon size={18} className="text-sand" />
                </div>
                <div>
                  <p className="text-xs text-charcoal-muted uppercase tracking-wider">{label}</p>
                  <p className="font-medium text-charcoal">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form className="card p-8 space-y-5">
          <h2 className="font-serif text-2xl text-charcoal">Send a Message</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">First Name</label>
              <input type="text" className="input-field" placeholder="Amira" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Last Name</label>
              <input type="text" className="input-field" placeholder="Hassan" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Email</label>
            <input type="email" className="input-field" placeholder="amira@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Subject</label>
            <input type="text" className="input-field" placeholder="How can we help?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Message</label>
            <textarea rows={5} className="input-field resize-none" placeholder="Tell us more..." />
          </div>
          <button type="submit" className="btn-primary w-full">Send Message</button>
        </form>
      </div>
    </div>
  );
}
