
import { stripe } from '@/lib/payment/stripe';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { priceId } = await req.json();

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
  });
  
  return NextResponse.json({ url: session.url });
}   