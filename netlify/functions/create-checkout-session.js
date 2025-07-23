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

    const line_items = items.map((item) => {
      const priceInCents = parseInt(item.price);

      if (isNaN(priceInCents)) {
        throw new Error(`Preço inválido para o produto: ${item.name}`);
      }

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name + (item.color ? ` (${item.color})` : ""),
          },
          unit_amount: priceInCents,
        },
        quantity: item.quantity || 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["PT"],
      },
      line_items,
      success_url: `${process.env.URL_SITE}/sucesso.html`,
      cancel_url: `${process.env.URL_SITE}/carrinho.html`,
    });

    return {
  statusCode: 200,
  body: JSON.stringify({ url: session.url }),
};
  } catch (error) {
    console.error("Erro ao criar sessão Stripe:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Erro desconhecido" }),
    };
  }
};
