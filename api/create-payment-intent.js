const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(200).json({ message: "API funcionando 🚀" });
    }

    const { amount } = req.body || {};

    if (!amount) {
      return res.status(400).json({ error: "Amount é obrigatório" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
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
};
