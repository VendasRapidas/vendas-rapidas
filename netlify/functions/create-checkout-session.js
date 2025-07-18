const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const { name, price } = JSON.parse(event.body);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name },
          unit_amount: price * 100, // euros para cêntimos
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
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
