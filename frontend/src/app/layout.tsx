import type { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/context/WishlistContext';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Modest Muse Style — Elegant Modest Fashion',
    template: '%s | Modest Muse Style',
  },
  description: 'Discover elegant, modest clothing crafted for the modern woman. Shop our curated collection of abayas, maxi dresses, and modest wear.',
  keywords: ['modest fashion', 'modest clothing', 'hijab fashion', 'modest wear', 'abayas', 'maxi dresses'],
  authors: [{ name: 'Modest Muse Style' }],
  openGraph: {
    type: 'website',
    siteName: 'Modest Muse Style',
    title: 'Modest Muse Style — Elegant Modest Fashion',
    description: 'Discover elegant, modest clothing crafted for the modern woman.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modest Muse Style',
    description: 'Elegant modest fashion for the modern woman.',
  },
};

export const viewport: Viewport = {
  themeColor: '#C4A882',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <WishlistProvider>
          <CartProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  background: '#2D2D2D',
                  color: '#FDFAF5',
                  borderRadius: '12px',
                  fontSize: '14px',
                },
              }}
            />
          </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
