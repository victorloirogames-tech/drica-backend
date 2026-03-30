import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // TESTE DE VIDA (GET)
  if (req.method === "GET") {
    return res.status(200).json({ message: "API funcionando 🚀" });
  }

  // BLOQUEIA OUTROS MÉTODOS
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { amount } = req.body || {};

    if (!amount) {
      return res.status(400).json({ error: "Amount é obrigatório" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount),
      currency: "brl",
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.error("ERRO STRIPE:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
}
