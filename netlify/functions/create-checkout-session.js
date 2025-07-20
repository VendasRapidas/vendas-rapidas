const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const { items } = JSON.parse(event.body);

    if (!items || !Array.isArray(items)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Itens inválidos." })
      };
    }

    const line_items = items.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name
        },
        unit_amount: item.price, // preço em cêntimos
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: 'https://teusite.netlify.app/sucesso.html',
      cancel_url: 'https://teusite.netlify.app/carrinho.html',
      shipping_address_collection: {
        allowed_countries: ['PT'], // Só Portugal
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id }),
    };

  } catch (error) {
    console.error("Erro Stripe:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro ao criar sessão de pagamento." })
    };
  }
};
