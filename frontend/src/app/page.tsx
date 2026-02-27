import HeroBanner from '@/components/home/HeroBanner';
import FeaturedCollections from '@/components/home/FeaturedCollections';
import BrandStoryTeaser from '@/components/home/BrandStoryTeaser';
import Newsletter from '@/components/home/Newsletter';
import Testimonials from '@/components/home/Testimonials';
import CategoryTiles from '@/components/home/CategoryTiles';
import PromoBanner from '@/components/home/PromoBanner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import BackToTop from '@/components/layout/BackToTop';

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <HeroBanner />
        <CategoryTiles />
        <FeaturedCollections />
        <PromoBanner />
        <BrandStoryTeaser />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
