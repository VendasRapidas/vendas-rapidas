const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const { items } = JSON.parse(event.body);

    if (!items || !Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Lista de produtos inválida" }),
      };
    }

    const baseUrl = process.env.URL_SITE;
    if (!baseUrl || !baseUrl.startsWith("http")) {
      console.error("Variável URL_SITE inválida:", baseUrl);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "URL_SITE mal configurado" }),
      };
    }

    const line_items = items.map(item => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name, // já vem com a cor, se houver
        },
        unit_amount: item.price,
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["PT"],
      },
      line_items,
      success_url: `${baseUrl}/sucesso.html`,
      cancel_url: `${baseUrl}/carrinho.html`,
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
