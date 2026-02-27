interface BlogContentProps {
  content: string;
}

export default function BlogContent({ content }: BlogContentProps) {
  return (
    <div
      className="prose prose-lg max-w-none
        prose-headings:font-serif prose-headings:text-charcoal
        prose-p:text-charcoal-muted prose-p:leading-relaxed
        prose-a:text-sand prose-a:no-underline hover:prose-a:underline
        prose-strong:text-charcoal
        prose-img:rounded-2xl
        prose-blockquote:border-l-sand prose-blockquote:text-charcoal-muted prose-blockquote:italic"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
