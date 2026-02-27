import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import BackToTop from '@/components/layout/BackToTop';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CartDrawer />
      <BackToTop />
    </>
  );
}
