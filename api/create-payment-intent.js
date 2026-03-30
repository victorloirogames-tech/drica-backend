const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {
  // Permitir apenas POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    // Garantir que tem body
    const { amount } = req.body || {};

    // Validar amount
    if (!amount || typeof amount !== "number") {
      return res.status(400).json({
        error: "Amount é obrigatório e deve ser número",
      });
    }

    // Criar pagamento no Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "brl",
    });

    // Retornar sucesso
    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.error("ERRO:", error);

    return res.status(500).json({
      error: error.message || "Erro interno",
    });
  }
};
