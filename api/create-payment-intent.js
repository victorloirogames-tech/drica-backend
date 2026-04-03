import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 3890, // R$ 38,90
      currency: "brl",
      automatic_payment_methods: { enabled: true },
    });

    console.log("CLIENT SECRET:", paymentIntent.client_secret);

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (err) {
    console.error("ERRO:", err);
    return res.status(500).json({ error: err.message });
  }
}
