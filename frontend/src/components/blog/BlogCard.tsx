import Link from 'next/link';
import Image from 'next/image';
import { formatDate, truncate } from '@/lib/utils';

interface BlogCardProps {
  post: {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage?: string;
    tags?: string[];
    author?: { name: string };
    publishedAt: string;
  };
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="aspect-[16/9] relative rounded-xl overflow-hidden bg-sand-50 mb-4">
          {post.coverImage ? (
            <Image src={post.coverImage} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-sand-300 text-sm font-medium font-serif">The Muse Journal</span>
            </div>
          )}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2 mb-2">
            {post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs font-medium text-sand uppercase tracking-wider">{tag}</span>
            ))}
          </div>
        )}

        <h3 className="font-serif text-xl text-charcoal group-hover:text-sand transition-colors leading-snug">
          {post.title}
        </h3>
        <p className="mt-2 text-sm text-charcoal-muted leading-relaxed">{truncate(post.excerpt, 120)}</p>

        <div className="mt-4 flex items-center gap-2 text-xs text-charcoal-muted">
          {post.author && <span>{post.author.name}</span>}
          {post.author && <span>·</span>}
          <span>{formatDate(post.publishedAt)}</span>
        </div>
      </Link>
    </article>
  );
}
