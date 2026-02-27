'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { axiosInstance } from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ShippingForm from './ShippingForm';
import PaymentForm from './PaymentForm';

type Step = 'shipping' | 'payment';

export default function CheckoutForm() {
  const [step, setStep] = useState<Step>('shipping');
  const [shippingData, setShippingData] = useState<any>(null);
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleShippingComplete = (data: any) => {
    setShippingData(data);
    setStep('payment');
  };

  const handlePaymentComplete = async ({ paymentMethod, paymentResult }: { paymentMethod: string; paymentResult?: any }) => {
    try {
      const shipping = subtotal >= 75 ? 0 : 8.99;
      const tax = subtotal * 0.08;

      await axiosInstance.post('/orders', {
        items: items.map((i) => ({ product: i.productId, name: i.name, image: i.image, price: i.price, quantity: i.quantity, size: i.size, color: i.color, sku: i.sku })),
        shippingAddress: shippingData,
        paymentMethod,
        paymentResult,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: subtotal + shipping + tax,
        guestEmail: !user ? shippingData.email : undefined,
      });

      clearCart();
      toast.success('Order placed successfully!');
      router.push('/account/orders');
    } catch {
      toast.error('Failed to place order. Please try again.');
    }
  };

  return (
    <div>
      {/* Steps indicator */}
      <div className="flex items-center gap-3 mb-8">
        {(['shipping', 'payment'] as Step[]).map((s, idx) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${step === s || (s === 'shipping' && step === 'payment') ? 'bg-charcoal text-cream' : 'bg-sand-100 text-charcoal-muted'}`}>
              {idx + 1}
            </div>
            <span className="text-sm font-medium capitalize text-charcoal">{s}</span>
            {idx < 1 && <span className="w-8 h-px bg-sand-200 ml-1" />}
          </div>
        ))}
      </div>

      {step === 'shipping' ? (
        <ShippingForm onComplete={handleShippingComplete} defaultEmail={user?.email} />
      ) : (
        <PaymentForm onComplete={handlePaymentComplete} onBack={() => setStep('shipping')} />
      )}
    </div>
  );
}
