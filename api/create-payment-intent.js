import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Valor é obrigatório" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // garante inteiro
      currency: "brl",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
    return res.status(500).json({ error: "Erro interno" });
  }
}
