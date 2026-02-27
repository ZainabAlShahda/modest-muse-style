import OrderTable from '@/components/admin/OrderTable';

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-charcoal mb-8">Orders</h1>
      <OrderTable />
    </div>
  );
}
