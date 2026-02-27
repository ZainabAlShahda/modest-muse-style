'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';

const TOP_SEARCHES = ['Abaya', 'Lawn', '3 Piece', 'Unstitched', 'Casual Wear', 'Formal Wear'];

interface SearchResult {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: { url: string }[];
  category?: { name: string };
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      const res = await fetch(`${apiBase}/products?search=${encodeURIComponent(q)}&limit=6`);
      const data = await res.json();
      setResults(data.data || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 350);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
  };

  const handleTopSearch = (term: string) => {
    onClose();
    router.push(`/shop?search=${encodeURIComponent(term)}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-cream shadow-2xl animate-slide-up">
        <div className="container-wide py-5">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <Search size={20} className="text-sand shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={handleChange}
              placeholder="Search for abayas, lawn, 3-piece sets…"
              className="flex-1 bg-transparent text-charcoal text-lg outline-none placeholder:text-charcoal-muted/60"
            />
            {query && (
              <button type="button" onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus(); }} className="text-charcoal-muted hover:text-charcoal">
                <X size={18} />
              </button>
            )}
            <button type="button" onClick={onClose} className="p-1 text-charcoal-muted hover:text-charcoal ml-2">
              <X size={22} />
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="border-t border-sand-100" />

        {/* Results / Suggestions */}
        <div className="container-wide py-6 max-h-[70vh] overflow-y-auto">
          {!query && (
            <div>
              <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-widest mb-3">Top Searches</p>
              <div className="flex flex-wrap gap-2">
                {TOP_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleTopSearch(term)}
                    className="px-4 py-2 rounded-full border border-sand-200 text-sm text-charcoal hover:bg-sand hover:text-white hover:border-sand transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="flex justify-center py-8">
              <span className="w-6 h-6 border-2 border-sand border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <p className="text-charcoal-muted text-sm py-4">No results for "<strong>{query}</strong>"</p>
          )}

          {!loading && results.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-widest mb-4">Products</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((product) => (
                  <Link
                    key={product._id}
                    href={`/shop/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-sand-50 transition-colors group"
                  >
                    <div className="w-14 h-14 rounded-lg bg-sand-100 overflow-hidden shrink-0">
                      {product.images[0]?.url ? (
                        <Image src={product.images[0].url} alt={product.name} width={56} height={56} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-charcoal-muted">{product.category?.name}</p>
                      <p className="text-sm font-medium text-charcoal truncate group-hover:text-sand transition-colors">{product.name}</p>
                      <p className="text-sm font-semibold text-charcoal">{formatPrice(product.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-sand-100">
                <button
                  onClick={handleSubmit as any}
                  className="flex items-center gap-2 text-sm font-medium text-sand hover:text-charcoal transition-colors"
                >
                  View all results for "{query}" <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
