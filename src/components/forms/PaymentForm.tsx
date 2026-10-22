import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';

interface PaymentFormProps {
  clientSecret: string;
}

export function PaymentForm({ clientSecret }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return; // Stripe.js n'est pas encore chargé
    }

    setIsLoading(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
    });

    if (submitError) {
      setError(submitError.message ?? 'Une erreur est survenue');
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />

      {error && <div className="error">{error}</div>}

      <button type="submit" disabled={!stripe || isLoading}>
        {isLoading ? 'Traitement...' : 'Payer'}
      </button>
    </form>
  );
}