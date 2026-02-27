import type { Metadata } from 'next';
import BlogCard from '@/components/blog/BlogCard';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { api } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Style inspiration, fashion guides, and modest living tips.',
};

async function getPosts() {
  try {
    const res = await api.get('/blog?limit=9');
    return res.data.data || [];
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="container-wide py-12">
      <Breadcrumb items={[{ label: 'Blog' }]} />
      <div className="mt-6 mb-12 text-center">
        <h1 className="font-serif text-5xl text-charcoal">The Muse Journal</h1>
        <p className="mt-4 text-charcoal-muted max-w-xl mx-auto">
          Style stories, modest living inspiration, and behind-the-scenes from our team.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-charcoal-muted py-20">No posts yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => <BlogCard key={post._id} post={post} />)}
        </div>
      )}
    </div>
  );
}
