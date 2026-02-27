import StatsCard from '@/components/admin/StatsCard';
import { ShoppingBag, Users, Package, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-charcoal mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <StatsCard title="Total Orders" value="–" icon={ShoppingBag} trend="+12%" />
        <StatsCard title="Revenue" value="–" icon={DollarSign} trend="+8%" />
        <StatsCard title="Products" value="–" icon={Package} trend="" />
        <StatsCard title="Customers" value="–" icon={Users} trend="+5%" />
      </div>

      <div className="card p-6">
        <h2 className="font-serif text-xl text-charcoal mb-4">Recent Orders</h2>
        <p className="text-charcoal-muted text-sm">Connect the API to view live data.</p>
      </div>
    </div>
  );
}
