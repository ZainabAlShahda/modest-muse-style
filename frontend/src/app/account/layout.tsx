import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="pt-20 min-h-screen bg-cream">
        {children}
      </div>
      <Footer />
      <CartDrawer />
    </>
  );
}
