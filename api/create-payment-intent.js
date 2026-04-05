import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // 🔥 CORS LIBERADO
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 🔥 IMPORTANTE (preflight request)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount, orderId } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "Pedido Confeitaria",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],

      success_url: `https://SEU-APP-AQUI.com/success?orderId=${orderId}`,
      cancel_url: `https://SEU-APP-AQUI.com/cancel`,
    });

    return res.status(200).json({
      url: session.url,
    });

  } catch (error) {
    console.error("ERRO STRIPE:", error);
    return res.status(500).json({ error: "Erro ao criar pagamento" });
  }
}
