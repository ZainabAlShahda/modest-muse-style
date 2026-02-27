'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface SizeGuideModalProps {
  onClose: () => void;
}

const SIZE_CHART = [
  { size: 'XS',  chest: '32"',  waist: '26"', hips: '35"', length: '52"' },
  { size: 'S',   chest: '34"',  waist: '28"', hips: '37"', length: '53"' },
  { size: 'M',   chest: '36"',  waist: '30"', hips: '39"', length: '54"' },
  { size: 'L',   chest: '38"',  waist: '32"', hips: '41"', length: '55"' },
  { size: 'XL',  chest: '40"',  waist: '34"', hips: '43"', length: '56"' },
  { size: 'XXL', chest: '42"',  waist: '36"', hips: '45"', length: '57"' },
  { size: '3XL', chest: '44"',  waist: '38"', hips: '47"', length: '58"' },
];

export default function SizeGuideModal({ onClose }: SizeGuideModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sand-100">
          <h2 className="font-serif text-2xl text-charcoal">Size Guide</h2>
          <button onClick={onClose} className="p-1 text-charcoal-muted hover:text-charcoal transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Table */}
        <div className="p-6 overflow-x-auto">
          <p className="text-xs text-charcoal-muted mb-4">All measurements are in inches. For the best fit, measure over your undergarments.</p>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-sand-100">
                {['Size', 'Chest', 'Waist', 'Hips', 'Shirt Length'].map((h) => (
                  <th key={h} className="pb-3 pr-4 font-semibold text-charcoal text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZE_CHART.map((row, i) => (
                <tr key={row.size} className={i % 2 === 0 ? 'bg-sand-50' : 'bg-white'}>
                  <td className="py-2.5 pr-4 font-semibold text-charcoal">{row.size}</td>
                  <td className="py-2.5 pr-4 text-charcoal-muted">{row.chest}</td>
                  <td className="py-2.5 pr-4 text-charcoal-muted">{row.waist}</td>
                  <td className="py-2.5 pr-4 text-charcoal-muted">{row.hips}</td>
                  <td className="py-2.5 pr-4 text-charcoal-muted">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 p-4 bg-sage-50 rounded-xl text-xs text-charcoal-muted leading-relaxed">
            <strong className="text-charcoal">How to measure:</strong><br />
            <span className="block mt-1"><strong>Chest:</strong> Measure around the fullest part of your bust.</span>
            <span className="block mt-1"><strong>Waist:</strong> Measure around the narrowest part of your waist.</span>
            <span className="block mt-1"><strong>Hips:</strong> Measure around the fullest part of your hips.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
