const stripe = Stripe('pk_live_51Rls9cCTAJQAvPL4M2VIWTBDXzUSLcTpR0z47iIluRGDSJ0XgUqEDtlJqlWplXXQi6VTOxImV9HteBIYiX8dOgyB00VDWG5w2t');

async function checkout(name, price) {
  try {
    const response = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price }),
    });

    const data = await response.json();

    if (data.id) {
      const result = await stripe.redirectToCheckout({ sessionId: data.id });
      if (result.error) {
        alert(result.error.message);
      }
    } else {
      alert('Erro ao criar sessão de pagamento');
    }
  } catch (error) {
    console.error('Erro no checkout:', error);
    alert('Erro ao processar o pagamento');
  }
}
