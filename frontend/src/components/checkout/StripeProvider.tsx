'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useMemo } from 'react';

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;

export default function StripeProvider({ children }: { children: React.ReactNode }) {
  const stripePromise = useMemo(() => loadStripe(PUBLISHABLE_KEY), []);

  return (
    <Elements
      stripe={stripePromise}
      options={{
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#C4A882',
            colorText: '#2D2D2D',
            colorBackground: '#FFFFFF',
            borderRadius: '12px',
            fontFamily: '"DM Sans", system-ui, sans-serif',
          },
        },
      }}
    >
      {children}
    </Elements>
  );
}
