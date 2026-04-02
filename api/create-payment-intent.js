const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  try {
    // ✅ Método correto
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    const { amount, order_id } = req.body || {};

    // ✅ Validação forte
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Valor inválido" });
    }

    // ✅ Converter para centavos
    const amountInCents = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "brl",
      metadata: {
        order_id: order_id || "sem_id",
      },
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
};
