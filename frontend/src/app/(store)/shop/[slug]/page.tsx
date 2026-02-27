import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ImageGallery from '@/components/product/ImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import RelatedProducts from '@/components/product/RelatedProducts';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { api } from '@/lib/api';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  try {
    const res = await api.get(`/products/${slug}`);
    return res.data.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: product.name,
    description: product.description.substring(0, 160),
    openGraph: { images: [product.images[0]?.url] },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <div className="container-wide py-8">
      <Breadcrumb
        items={[
          { label: 'Shop', href: '/shop' },
          { label: product.category?.name || 'Category', href: `/shop?category=${product.category?._id}` },
          { label: product.name },
        ]}
      />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ImageGallery images={product.images} productName={product.name} />
        <ProductInfo product={product} />
      </div>

      <RelatedProducts categoryId={product.category?._id} currentSlug={product.slug} />
    </div>
  );
}
