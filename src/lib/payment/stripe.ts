import Stripe from "stripe";

// AJOUTÉ - Vérifie les clés au premier usage pour éviter de démarrer un checkout mal configuré.
const stripeSecret = process.env.STRIPE_SECRET;

if (!stripeSecret) {
  throw new Error("STRIPE_SECRET n'est pas configurée.");
}

// MODIFIÉ - Initialise le SDK Stripe avec le secret serveur requis.
export const stripe = new Stripe(stripeSecret, {
  apiVersion: "2026-09-30.endive",
  typescript: true,
});
