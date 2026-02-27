import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
}

export default function StatsCard({ title, value, icon: Icon, trend }: StatsCardProps) {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-charcoal-muted uppercase tracking-wider font-medium">{title}</p>
          <p className="font-serif text-3xl text-charcoal mt-2">{value}</p>
          {trend && <p className="text-xs text-sage mt-1 font-medium">{trend} this month</p>}
        </div>
        <div className="w-12 h-12 rounded-2xl bg-sand-50 flex items-center justify-center">
          <Icon size={22} className="text-sand" />
        </div>
      </div>
    </div>
  );
}
