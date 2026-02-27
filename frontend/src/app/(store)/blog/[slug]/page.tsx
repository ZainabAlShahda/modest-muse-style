import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import BlogContent from '@/components/blog/BlogContent';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { api } from '@/lib/api';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  try {
    const res = await api.get(`/blog/${slug}`);
    return res.data.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { images: [post.coverImage] },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article className="container-wide py-12 max-w-4xl">
      <Breadcrumb items={[{ label: 'Blog', href: '/blog' }, { label: post.title }]} />

      <header className="mt-8 mb-10">
        <div className="flex items-center gap-2 text-sm text-charcoal-muted mb-4">
          {post.tags?.map((tag: string) => (
            <span key={tag} className="bg-sand-50 text-sand px-3 py-1 rounded-full text-xs font-medium">{tag}</span>
          ))}
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-charcoal leading-tight">{post.title}</h1>
        <p className="mt-4 text-lg text-charcoal-muted leading-relaxed">{post.excerpt}</p>
        <div className="mt-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sand-100 flex items-center justify-center">
            <span className="text-sand font-medium text-sm">{post.author?.name?.[0]}</span>
          </div>
          <div>
            <p className="font-medium text-charcoal text-sm">{post.author?.name}</p>
            <p className="text-xs text-charcoal-muted">
              {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </header>

      {post.coverImage && (
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-10">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
        </div>
      )}

      <BlogContent content={post.content} />
    </article>
  );
}
