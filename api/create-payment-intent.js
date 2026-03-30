import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ message: "API funcionando 🚀" });
  }

  try {
    const { amount } = req.body || {};

    if (!amount) {
      return res.status(400).json({ error: "Amount é obrigatório" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "brl",
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
