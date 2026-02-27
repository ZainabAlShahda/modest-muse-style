'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { SORT_OPTIONS } from '@/lib/constants';

interface SortDropdownProps {
  currentSort?: string;
}

export default function SortDropdown({ currentSort }: SortDropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      value={currentSort || 'newest'}
      onChange={handleChange}
      className="input-field w-auto text-sm py-2 pr-8 cursor-pointer"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
