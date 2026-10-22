import { stripePromise } from '@/lib/payment/stripe-client';
import { Elements } from '@stripe/react-stripe-js';

export function StripeProvider({ children }: { children: React.ReactNode }) {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
}