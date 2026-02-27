import type { Metadata } from 'next';
import CartPageContent from '@/components/cart/CartPageContent';
import Breadcrumb from '@/components/layout/Breadcrumb';

export const metadata: Metadata = {
  title: 'Your Cart',
  description: 'Review your selected items.',
};

export default function CartPage() {
  return (
    <div className="container-wide py-8">
      <Breadcrumb items={[{ label: 'Cart' }]} />
      <h1 className="mt-6 font-serif text-4xl text-charcoal">Your Cart</h1>
      <div className="mt-8">
        <CartPageContent />
      </div>
    </div>
  );
}
