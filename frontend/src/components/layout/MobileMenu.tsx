'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn('fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm transition-opacity duration-300', isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none')}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn('fixed left-0 top-0 bottom-0 z-50 w-72 bg-cream shadow-2xl transition-transform duration-300', isOpen ? 'translate-x-0' : '-translate-x-full')}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-sand-100">
          <Link href="/" onClick={onClose}>
            <Image src="/logo.png" alt="Modest Muse Style" width={120} height={45} className="h-9 w-auto object-contain" />
          </Link>
          <button onClick={onClose} className="p-1.5 text-charcoal hover:text-sand transition-colors" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="p-6 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="block py-3 px-4 font-medium text-charcoal hover:text-sand hover:bg-sand-50 rounded-xl transition-all"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-sand-100">
          <Link href="/account" onClick={onClose} className="btn-primary w-full text-center block">
            My Account
          </Link>
        </div>
      </div>
    </>
  );
}
