import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import BackToTop from '@/components/layout/BackToTop';
import ChatWidget from '@/components/chat/ChatWidget';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        <Header />
      </div>
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CartDrawer />
      <BackToTop />
      <ChatWidget />
    </>
  );
}
