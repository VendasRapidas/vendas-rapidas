const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    console.log('Recebido event.body:', event.body);

    const { name, price } = JSON.parse(event.body);
    const baseUrl = process.env.URL_BASE;

    if (!baseUrl) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Variável de ambiente URL_BASE não definida' }),
      };
    }

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
      success_url: `${baseUrl}/sucesso.html`,
      cancel_url: `${baseUrl}/cancelado.html`,
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
