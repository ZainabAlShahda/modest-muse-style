'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Users, FileText, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/users', label: 'Users', icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-60 min-h-screen bg-charcoal text-cream flex flex-col shrink-0">
      <div className="px-5 py-4 border-b border-white/10">
        <Link href="/" className="inline-block">
          <Image src="/logo.png" alt="Modest Muse Style" width={120} height={45} className="h-9 w-auto object-contain brightness-0 invert opacity-90" />
        </Link>
        <p className="text-xs text-cream/35 mt-1.5 tracking-widest uppercase">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
              pathname === href ? 'bg-sand text-white' : 'text-cream/70 hover:text-cream hover:bg-white/10'
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-cream/70 hover:text-cream hover:bg-white/10 transition-all"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
