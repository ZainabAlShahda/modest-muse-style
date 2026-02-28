import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook } from 'lucide-react';
import { BRAND, NAV_LINKS } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream mt-24">
      {/* Top strip */}
      <div className="bg-sand">
        <div className="container-wide py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-cream/90">
          <p className="font-medium tracking-wide">🌿 Free shipping on orders over Rs. 5,000</p>
          <p className="text-cream/70 text-xs">Modest Fashion, Delivered at Doorstep.</p>
        </div>
      </div>

      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand + logo */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Modest Muse Style"
                width={160}
                height={60}
                className="h-14 w-auto object-contain brightness-0 invert opacity-90"
              />
            </Link>
            <p className="mt-4 text-sm text-cream/65 max-w-xs leading-relaxed">{BRAND.tagline}</p>
            <div className="flex gap-3 mt-6">
              {[
                { label: 'Instagram', icon: Instagram },
                { label: 'Facebook',  icon: Facebook },
              ].map(({ label, icon: Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-sand transition-colors duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
              {/* Pinterest — custom SVG (not available in lucide-react) */}
              <a
                href="#"
                aria-label="Pinterest"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-sand transition-colors duration-200"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-medium text-xs uppercase tracking-widest text-cream/40 mb-5">Explore</h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-cream/65 hover:text-cream transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-medium text-xs uppercase tracking-widest text-cream/40 mb-5">Support</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Track My Order', href: '/track-order' },
                { label: 'Sizing Guide',   href: '/contact' },
                { label: 'Shipping & Returns', href: '/contact' },
                { label: 'FAQ',           href: '/contact' },
                { label: 'Contact Us',    href: '/contact' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-cream/65 hover:text-cream transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-4 bg-white/5 rounded-xl">
              <p className="text-xs text-cream/50 mb-1">Need help?</p>
              <a href={`mailto:${BRAND.email}`} className="text-sm text-sand-200 hover:text-cream transition-colors font-medium">
                {BRAND.email}
              </a>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div className="border-t border-white/10 mt-14 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-cream/35">© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>

            {/* Payment icons */}
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <span className="text-xs text-cream/35 mr-1">We accept:</span>
              {/* Visa */}
              <span className="bg-white rounded px-2 py-1 flex items-center h-7">
                <svg viewBox="0 0 60 20" width="38" height="13" aria-label="Visa">
                  <text x="0" y="15" fontFamily="Arial" fontWeight="bold" fontSize="16" fill="#1A1F71">VISA</text>
                </svg>
              </span>
              {/* Mastercard */}
              <span className="bg-white rounded px-2 py-1 flex items-center h-7 gap-1">
                <svg viewBox="0 0 38 24" width="30" height="19" aria-label="Mastercard">
                  <circle cx="12" cy="12" r="12" fill="#EB001B"/>
                  <circle cx="26" cy="12" r="12" fill="#F79E1B"/>
                  <path d="M19 5.3A12 12 0 0 1 24 12a12 12 0 0 1-5 6.7A12 12 0 0 1 14 12a12 12 0 0 1 5-6.7z" fill="#FF5F00"/>
                </svg>
              </span>
              {/* JazzCash */}
              <span className="bg-white rounded px-2 py-1 flex items-center h-7">
                <svg viewBox="0 0 40 16" width="40" height="16" aria-label="JazzCash">
                  <rect width="40" height="16" rx="2" fill="#EE3124"/>
                  <text x="50%" y="12" dominantBaseline="auto" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="sans-serif">JazzCash</text>
                </svg>
              </span>
              {/* EasyPaisa */}
              <span className="bg-white rounded px-2 py-1 flex items-center h-7">
                <svg viewBox="0 0 48 16" width="48" height="16" aria-label="EasyPaisa">
                  <rect width="48" height="16" rx="2" fill="#4CAF50"/>
                  <text x="50%" y="12" dominantBaseline="auto" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">EasyPaisa</text>
                </svg>
              </span>
              {/* Cash on Delivery */}
              <span className="bg-white rounded px-2 py-1 flex items-center h-7">
                <svg viewBox="0 0 30 16" width="30" height="16" aria-label="Cash on Delivery">
                  <rect width="30" height="16" rx="2" fill="#617060"/>
                  <text x="50%" y="12" dominantBaseline="auto" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="sans-serif">COD</text>
                </svg>
              </span>
            </div>

            <div className="flex gap-6 text-xs text-cream/35">
              <Link href="#" className="hover:text-cream/60 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-cream/60 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
