'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, Heart } from 'lucide-react';

export default function AccountPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-sand border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="container-wide py-12">
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-charcoal">My Account</h1>
        <p className="mt-2 text-charcoal-muted">Welcome back, {user.name}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: ShoppingBag, title: 'My Orders', desc: 'Track and view your order history', href: '/account/orders' },
          { icon: User, title: 'Profile Settings', desc: 'Manage your personal information', href: '/account/profile' },
          { icon: Heart, title: 'Wishlist', desc: 'Your saved items', href: '/shop?wishlist=true' },
        ].map(({ icon: Icon, title, desc, href }) => (
          <Link key={title} href={href} className="card p-6 hover:scale-[1.01] transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-sand-50 flex items-center justify-center mb-4">
              <Icon size={22} className="text-sand" />
            </div>
            <h3 className="font-serif text-xl text-charcoal">{title}</h3>
            <p className="mt-1 text-sm text-charcoal-muted">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
