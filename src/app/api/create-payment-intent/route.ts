import { stripe } from "@/lib/payment/stripe";

export async function POST(request: Request) {
  try {
    const { amount, currency = 'eur' } = await request.json();

    // Vérification basique (tu peux ajouter une validation Zod si besoin)
    if (!amount || typeof amount !== 'number') {
      return Response.json(
        { error: 'Montant invalide ou manquant.' },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // En centimes (ex : 1000 = 10 €)
      currency,
      automatic_payment_methods: { enabled: true },
    });

    return Response.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Erreur Stripe PaymentIntent :', error);

    return Response.json(
      { error: 'Impossible de créer le PaymentIntent.' },
      { status: 500 }
    );
  }
}