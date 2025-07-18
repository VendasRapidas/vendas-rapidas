const stripe = Stripe('pk_live_xxxxxx'); // Substitui pela tua PUBLIC KEY do Stripe

async function checkout(name, price) {
  try {
    const response = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify({ name, price }),
    });

    const data = await response.json();

    if (data.id) {
      stripe.redirectToCheckout({ sessionId: data.id });
    } else {
      alert('Erro ao criar sessão de pagamento');
    }
  } catch (error) {
    console.error('Erro no checkout:', error);
  }
}
