const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const { name, price } = JSON.parse(event.body);

    if (!name || !price) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Dados do produto incompletos" }),
      };
    }

    const baseUrl = process.env.URL_SITE;
    if (!baseUrl || !baseUrl.startsWith("http")) {
      console.error("Variável URL_SITE inválida:", baseUrl);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Configuração de URL_SITE inválida" }),
      };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/`,        // Volta para a homepage depois de pagar
      cancel_url: `${baseUrl}/carrinho.html`,  // Volta para carrinho se cancelar
      // O email do comprador é enviado automaticamente pelo Stripe
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id }),
    };
  } catch (error) {
    console.error("Erro ao criar sessão Stripe:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro ao criar sessão de pagamento" }),
    };
  }
};
