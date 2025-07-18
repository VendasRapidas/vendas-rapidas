// netlify/functions/create-checkout-session.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    // Pega no nome e preço do produto que foi enviado
    const { name, price } = JSON.parse(event.body);

    // Cria a sessão de pagamento no Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name },
          unit_amount: price * 100, // Preço em cêntimos (em vez de euros)
        },
        quantity: 1,
      }],
      mode: 'payment',  // A sessão é de pagamento
      success_url: 'https://vendasrapidas.netlify.app/sucesso.html',  // Página de sucesso
      cancel_url: 'https://vendasrapidas.netlify.app/cancelado.html',  // Página de cancelamento
    });

    // Retorna o ID da sessão criada para o frontend
    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id }),
    };
  } catch (error) {
    // Caso ocorra um erro, devolve a mensagem de erro
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
