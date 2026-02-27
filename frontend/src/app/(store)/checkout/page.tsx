import type { Metadata } from 'next';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import StripeProvider from '@/components/checkout/StripeProvider';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your purchase securely.',
};

export default function CheckoutPage() {
  return (
    <div className="container-wide py-8">
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-charcoal">Checkout</h1>
        <p className="mt-2 text-sm text-charcoal-muted">Multiple secure payment options available.</p>
      </div>

      <StripeProvider>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <CheckoutForm />
          </div>
          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>
      </StripeProvider>
    </div>
  );
}
