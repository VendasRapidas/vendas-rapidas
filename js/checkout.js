const stripe = Stripe('pk_live_51Rls9cCTAJQAvPL4M2VIWTBDXzUSLcTpR0z47iIluRGDSJ0XgUqEDtlJqlWplXXQi6VTOxImV9HteBIYiX8dOgyB00VDWG5w2t'); 

async function checkout(name, price) {
  try {
    const url = window.location.hostname === 'localhost' 
      ? 'http://localhost:4242/create-checkout-session'
      : '/.netlify/functions/create-checkout-session';
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, price }),
    });

    const data = await response.json();

    if (data.id) {
      await stripe.redirectToCheckout({ sessionId: data.id });
    } else {
      alert('Erro ao criar sessão de pagamento');
    }
  } catch (error) {
    console.error('Erro no checkout:', error);
    alert('Erro ao processar o pagamento');
  }
}
