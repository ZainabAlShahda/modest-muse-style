import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'sand' | 'sage' | 'blush' | 'charcoal';
  className?: string;
}

export default function Badge({ children, variant = 'sand', className }: BadgeProps) {
  const variants = {
    sand: 'bg-sand-100 text-sand-500',
    sage: 'bg-sage-100 text-sage-500',
    blush: 'bg-blush-100 text-blush-500',
    charcoal: 'bg-charcoal-light text-cream',
  };
  return (
    <span className={cn('inline-block px-3 py-1 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}
