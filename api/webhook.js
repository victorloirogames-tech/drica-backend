export const config = {
  api: {
    bodyParser: false,
  },
};

const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Erro webhook:", err.message);
    return res.status(400).send(`Erro: ${err.message}`);
  }

  // 🔥 QUANDO PAGAMENTO FOR CONFIRMADO
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    console.log("✅ PAGAMENTO APROVADO:", paymentIntent.id);

    // 👉 AQUI você vai marcar como pago depois
  }

  res.status(200).json({ received: true });
};