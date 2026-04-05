import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // ✅ CORS LIBERADO
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Preflight (OBRIGATÓRIO)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ✅ Só aceita POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount, orderId } = req.body;

    console.log("📥 RECEBIDO:", { amount, orderId });

    // ❗ validação básica (evita erro silencioso)
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Valor inválido" });
    }

    // ✅ CRIA SESSÃO STRIPE
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

      // 🔥 URL CORRIGIDA (NUNCA USAR FAKE)
      success_url: `https://google.com`,
      cancel_url: `https://google.com`,
    });

    console.log("✅ SESSION CRIADA:", session.url);

    return res.status(200).json({
      url: session.url,
    });

  } catch (error) {
    console.error("❌ ERRO STRIPE:", error);

    return res.status(500).json({
      error: "Erro ao criar pagamento",
      message: error.message,
    });
  }
}
