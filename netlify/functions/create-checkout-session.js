const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  console.log('Recebido event.body:', event.body);  // Log do corpo recebido

  try {
    const { name, price } = JSON.parse(event.body);
    console.log('Nome:', name, 'Preço:', price);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name },
          unit_amount: price * 100, // preço em cêntimos
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'https://vendasrapidas.netlify.app/sucesso.html',
      cancel_url: 'https://vendasrapidas.netlify.app/cancelado.html',
    });

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
