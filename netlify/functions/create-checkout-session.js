// netlify/functions/create-checkout-session.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    console.log('Recebido body:', event.body);

    const { name, price } = JSON.parse(event.body);

    console.log('Dados extraídos:', { name, price });
    console.log('Usando chave secreta:', process.env.STRIPE_SECRET_KEY ? 'Sim' : 'Não');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name },
          unit_amount: price * 100, // Preço em cêntimos
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'https://vendasrapidas.netlify.app/sucesso.html',
      cancel_url: 'https://vendasrapidas.netlify.app/cancelado.html',
    });

    console.log('Sessão criada:', session.id);

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id }),
    };
  } catch (error) {
    console.error('Erro na criação da sessão:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
