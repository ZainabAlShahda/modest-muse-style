'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { ShoppingBag, User, Menu, Search, Heart } from 'lucide-react';
import SearchOverlay from './SearchOverlay';
import { NAV_LINKS } from '@/lib/constants';
import MobileMenu from './MobileMenu';
import { cn } from '@/lib/utils';

export default function Header() {
  const { itemCount, openCart } = useCart();
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-cream/96 backdrop-blur-md shadow-sm border-b border-sand-100'
            : 'bg-cream/80 backdrop-blur-sm'
        )}
      >
        <div className="container-wide">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-charcoal hover:text-sand transition-colors"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/logo.png"
                alt="Modest Muse Style"
                width={160}
                height={60}
                className="h-10 md:h-12 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-charcoal-light hover:text-sand transition-colors tracking-wide relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-sand rounded-full transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Action icons */}
            <div className="flex items-center gap-0.5 md:gap-1">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 text-charcoal-light hover:text-sand transition-colors rounded-lg hover:bg-sand-50"
                aria-label="Search"
              >
                <Search size={19} />
              </button>
              <Link
                href={user ? '/account' : '/login'}
                className="p-2.5 text-charcoal-light hover:text-sand transition-colors rounded-lg hover:bg-sand-50"
                aria-label="Account"
              >
                <User size={19} />
              </Link>
              {user && (
                <Link
                  href="/account"
                  className="p-2.5 text-charcoal-light hover:text-sand transition-colors rounded-lg hover:bg-sand-50 relative"
                  aria-label={`Wishlist (${wishlist.length} items)`}
                >
                  <Heart size={19} />
                  {wishlist.length > 0 && (
                    <span className="absolute top-1 right-1 bg-blush text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                      {wishlist.length > 9 ? '9+' : wishlist.length}
                    </span>
                  )}
                </Link>
              )}
              <button
                onClick={openCart}
                className="p-2.5 text-charcoal-light hover:text-sand transition-colors rounded-lg hover:bg-sand-50 relative"
                aria-label={`Cart (${itemCount} items)`}
              >
                <ShoppingBag size={19} />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-sand text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
