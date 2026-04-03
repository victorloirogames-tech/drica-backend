import Stripe from "stripe";
import { buffer } from "micro";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Erro webhook:", err.message);
    return res.status(400).send(`Erro: ${err.message}`);
  }

  // 🔥 EVENTOS IMPORTANTES
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      console.log("✅ CHECKOUT FINALIZADO:", session.id);

      // 👉 Aqui é o mais importante
      // Salvar pedido como pago no banco

      break;

    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log("💰 PAGAMENTO CONFIRMADO:", paymentIntent.id);

      break;

    default:
      console.log(`⚠️ Evento não tratado: ${event.type}`);
  }

  res.status(200).json({ received: true });
}
