'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationMeta {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function Pagination({ meta }: { meta: PaginationMeta }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  if (meta.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => goToPage(meta.page - 1)}
        disabled={!meta.hasPrevPage}
        className="p-2 rounded-xl border border-sand-200 text-charcoal hover:bg-sand-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={18} />
      </button>

      {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
            page === meta.page ? 'bg-charcoal text-cream' : 'border border-sand-200 text-charcoal hover:bg-sand-50'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => goToPage(meta.page + 1)}
        disabled={!meta.hasNextPage}
        className="p-2 rounded-xl border border-sand-200 text-charcoal hover:bg-sand-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
