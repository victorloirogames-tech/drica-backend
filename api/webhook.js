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

  console.log("📩 Evento recebido:", event.type);

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;

      console.log("💰 PAGAMENTO APROVADO:", paymentIntent.id);

      // 👉 AQUI tu atualiza teu pedido (futuro)
      break;

    case "payment_intent.payment_failed":
      console.log("❌ PAGAMENTO FALHOU");
      break;

    default:
      console.log("⚠️ Evento ignorado:", event.type);
  }

  res.status(200).json({ received: true });
}
