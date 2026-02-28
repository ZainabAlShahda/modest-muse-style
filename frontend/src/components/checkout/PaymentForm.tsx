'use client';

import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Lock, ArrowLeft, CreditCard, Smartphone, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { axiosInstance } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

type PaymentMethod = 'card' | 'jazzcash' | 'easypaisa' | 'cod';

interface PaymentFormProps {
  onComplete: (result: { paymentMethod: PaymentMethod; paymentResult?: any }) => void;
  onBack: () => void;
}

const METHODS: { id: PaymentMethod; label: string; sub: string; icon: React.ReactNode }[] = [
  {
    id: 'card',
    label: 'Credit / Debit Card',
    sub: 'Visa, Mastercard, UnionPay',
    icon: <CreditCard size={20} />,
  },
  {
    id: 'jazzcash',
    label: 'JazzCash',
    sub: 'Pay with your JazzCash wallet',
    icon: (
      <svg viewBox="0 0 40 40" width="20" height="20" fill="none">
        <circle cx="20" cy="20" r="20" fill="#EE3124" />
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="sans-serif">JC</text>
      </svg>
    ),
  },
  {
    id: 'easypaisa',
    label: 'EasyPaisa',
    sub: 'Pay with your EasyPaisa account',
    icon: (
      <svg viewBox="0 0 40 40" width="20" height="20" fill="none">
        <circle cx="20" cy="20" r="20" fill="#4CAF50" />
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="sans-serif">EP</text>
      </svg>
    ),
  },
  {
    id: 'cod',
    label: 'Cash on Delivery',
    sub: 'Pay when your order arrives',
    icon: <Package size={20} />,
  },
];

// Approximate PKR → USD rate for Stripe (update periodically)
const PKR_TO_USD = 280;

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '15px',
      color: '#1C261A',
      fontFamily: '"DM Sans", system-ui, sans-serif',
      '::placeholder': { color: '#617060' },
      iconColor: '#2D5A1B',
    },
    invalid: { color: '#ef4444', iconColor: '#ef4444' },
  },
};

export default function PaymentForm({ onComplete, onBack }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { subtotal } = useCart();

  const [method, setMethod] = useState<PaymentMethod>('card');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [cardError, setCardError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const shipping = subtotal >= 75 ? 0 : 8.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const validatePhone = (value: string) => {
    if (!value) return 'Mobile number is required.';
    if (!/^03\d{9}$/.test(value)) return 'Enter a valid Pakistani number (e.g. 03001234567).';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setCardError('');
    setPhoneError('');

    try {
      // ── Credit / Debit Card ─────────────────────────────────────
      if (method === 'card') {
        if (!stripe || !elements) return;

        const { data } = await axiosInstance.post('/payment/create-intent', {
          amount: parseFloat((total / PKR_TO_USD).toFixed(2)),
          currency: 'usd',
        });
        const { clientSecret } = data.data;

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) throw new Error('Card element not mounted');

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: cardElement },
        });

        if (error) {
          setCardError(error.message || 'Payment failed. Please try again.');
          return;
        }

        if (paymentIntent?.status === 'succeeded') {
          toast.success('Payment successful!');
          onComplete({
            paymentMethod: 'card',
            paymentResult: {
              id: paymentIntent.id,
              status: paymentIntent.status,
              updateTime: new Date().toISOString(),
            },
          });
        }
        return;
      }

      // ── JazzCash ────────────────────────────────────────────────
      if (method === 'jazzcash') {
        const err = validatePhone(phone);
        if (err) { setPhoneError(err); return; }

        const { data } = await axiosInstance.post('/payment/jazzcash', {
          mobileNumber: phone,
          amount: total,
        });

        toast.success('JazzCash payment initiated! Check your phone for confirmation.');
        onComplete({
          paymentMethod: 'jazzcash',
          paymentResult: { id: data?.data?.txnRefNo || `JC-${Date.now()}`, status: 'pending', mobileNumber: phone },
        });
        return;
      }

      // ── EasyPaisa ────────────────────────────────────────────────
      if (method === 'easypaisa') {
        const err = validatePhone(phone);
        if (err) { setPhoneError(err); return; }

        const { data } = await axiosInstance.post('/payment/easypaisa', {
          mobileNumber: phone,
          amount: total,
        });

        toast.success('EasyPaisa payment initiated! Check your phone for the OTP.');
        onComplete({
          paymentMethod: 'easypaisa',
          paymentResult: { id: data?.data?.transactionId || `EP-${Date.now()}`, status: 'pending', mobileNumber: phone },
        });
        return;
      }

      // ── Cash on Delivery ─────────────────────────────────────────
      if (method === 'cod') {
        toast.success('Order placed! Pay cash when your order arrives.');
        onComplete({
          paymentMethod: 'cod',
          paymentResult: { id: `COD-${Date.now()}`, status: 'pending' },
        });
      }

    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(msg);
      if (method === 'card') setCardError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="font-serif text-2xl text-charcoal">Payment Method</h2>

      {/* Method selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => { setMethod(m.id); setCardError(''); setPhoneError(''); setPhone(''); }}
            className={cn(
              'flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all',
              method === m.id
                ? 'border-sand bg-sand-50 text-charcoal'
                : 'border-sand-100 bg-white text-charcoal-muted hover:border-sand-200'
            )}
          >
            <span className={cn('shrink-0', method === m.id ? 'text-sand' : 'text-charcoal-muted')}>
              {m.icon}
            </span>
            <div>
              <p className="text-sm font-semibold leading-tight">{m.label}</p>
              <p className="text-xs text-charcoal-muted mt-0.5">{m.sub}</p>
            </div>
            {method === m.id && (
              <span className="ml-auto w-4 h-4 rounded-full bg-sand flex items-center justify-center shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Method-specific form ── */}

      {/* Card */}
      {method === 'card' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-charcoal-muted bg-sage-50 border border-sage-100 px-4 py-3 rounded-xl">
            <Lock size={14} className="text-sage shrink-0" />
            <span>
              Your card details are encrypted and processed securely via Stripe.{' '}
              <span className="font-medium text-charcoal">
                Card is charged in USD (~${(total / PKR_TO_USD).toFixed(2)})
              </span>
            </span>
          </div>
          <div>
            <label className="text-sm font-medium text-charcoal mb-2 block">Card Details</label>
            <div className="border border-sand-200 rounded-xl px-4 py-3.5 bg-white focus-within:ring-2 focus-within:ring-sand focus-within:border-transparent transition-all">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
            {cardError && <p className="mt-2 text-sm text-red-500">⚠ {cardError}</p>}
            <p className="mt-2 text-xs text-charcoal-muted">
              Test card:{' '}
              <span className="font-mono bg-sand-50 px-1.5 py-0.5 rounded">4242 4242 4242 4242</span>
              {' '}· any future date · any CVV
            </p>
          </div>
        </div>
      )}

      {/* JazzCash */}
      {method === 'jazzcash' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-charcoal-muted bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
            <Smartphone size={14} className="text-red-500 shrink-0" />
            <span>Enter your JazzCash mobile number. You will receive a payment confirmation on your phone.</span>
          </div>
          <div>
            <label className="text-sm font-medium text-charcoal mb-2 block">JazzCash Mobile Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setPhoneError(''); }}
              placeholder="03001234567"
              maxLength={11}
              className="input-field w-full"
            />
            {phoneError && <p className="mt-1.5 text-sm text-red-500">⚠ {phoneError}</p>}
          </div>
        </div>
      )}

      {/* EasyPaisa */}
      {method === 'easypaisa' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-charcoal-muted bg-green-50 border border-green-100 px-4 py-3 rounded-xl">
            <Smartphone size={14} className="text-green-600 shrink-0" />
            <span>Enter your EasyPaisa mobile number. An OTP will be sent to confirm your payment.</span>
          </div>
          <div>
            <label className="text-sm font-medium text-charcoal mb-2 block">EasyPaisa Mobile Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setPhoneError(''); }}
              placeholder="03001234567"
              maxLength={11}
              className="input-field w-full"
            />
            {phoneError && <p className="mt-1.5 text-sm text-red-500">⚠ {phoneError}</p>}
          </div>
        </div>
      )}

      {/* Cash on Delivery */}
      {method === 'cod' && (
        <div className="flex items-start gap-3 bg-sand-50 border border-sand-100 px-4 py-4 rounded-xl">
          <Package size={20} className="text-sand shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-charcoal">Pay when your order arrives</p>
            <p className="text-sm text-charcoal-muted mt-1 leading-relaxed">
              Our delivery partner will collect the exact amount at your door. Please have the exact cash ready.
            </p>
          </div>
        </div>
      )}

      {/* Total recap */}
      <div className="bg-cream-dark rounded-xl px-4 py-3 flex justify-between items-center">
        <span className="text-sm font-medium text-charcoal">Total to pay</span>
        <span className="font-semibold text-charcoal text-lg">{formatPrice(total)}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="btn-secondary flex items-center gap-2 shrink-0"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          type="submit"
          disabled={isProcessing || (method === 'card' && !stripe)}
          className="btn-primary flex-1 py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing…
            </>
          ) : (
            <>
              {method === 'cod' ? <Package size={16} /> : <Lock size={16} />}
              {method === 'cod' ? 'Place Order' : 'Pay Now'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
