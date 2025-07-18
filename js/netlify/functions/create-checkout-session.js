// netlify/functions/create-checkout-session.js
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async function(event, context) {
  try {
    // O corpo da requisição vem como string no event.body
    const { product } = JSON.parse(event.body);

    // Criar sessão de checkout no Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: product.nome,
            },
            unit_amount: product.preco * 100, // converter para cêntimos
          },
          quantity: 1,
        },
      ],
      // Troca estas URLs para o domínio onde o teu site estiver publicado
      success_url: "https://teusite.netlify.app/sucesso.html",
      cancel_url: "https://teusite.netlify.app/cancelado.html",
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error("Erro Stripe:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro ao criar sessão de pagamento." }),
    };
  }
};
