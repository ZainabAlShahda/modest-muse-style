import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-sm text-charcoal-muted flex-wrap">
        <li>
          <Link href="/" className="hover:text-sand transition-colors">Home</Link>
        </li>
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-1.5">
            <ChevronRight size={14} className="text-charcoal-muted/50" />
            {item.href ? (
              <Link href={item.href} className="hover:text-sand transition-colors">{item.label}</Link>
            ) : (
              <span className="text-charcoal font-medium truncate max-w-[200px]">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
