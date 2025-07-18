const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const { name, price } = JSON.parse(event.body);

    // Criar a sessão de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd', // Ajusta para a tua moeda
            product_data: {
              name: name,
            },
            unit_amount: price, // preço em centavos, ex: 1999 = 19.99 USD
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.URL_BASE}/success.html`, // Página de sucesso
      cancel_url: `${process.env.URL_BASE}/cancel.html`,   // Página de cancelamento
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id }),
    };

  } catch (error) {
    console.error('Erro na função:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
