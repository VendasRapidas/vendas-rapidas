// netlify/functions/create-checkout-session.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    console.log("URL_SITE:", process.env.URL_SITE); // Debug da URL do site

    const { name, price } = JSON.parse(event.body);

    if (!name || !price) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Dados do produto incompletos" }),
      };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name,
            },
            unit_amount: price, // preço em centavos
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.URL_SITE}/sucesso.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL_SITE}/cancelado.html`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error("Erro ao criar sessão Stripe:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro ao criar sessão de pagamento" }),
    };
  }
};
