const stripe = Stripe('pk_live_51Rls9cCTAJQAvPL4M2VIWTBDXzUSLcTpR0z47iIluRGDSJ0XgUqEDtlJqlWplXXQi6VTOxImV9HteBIYiX8dOgyB00VDWG5w2t'); // Substitui com a tua chave pública do Stripe

async function checkout(name, price) {
  try {
    // Definir a URL dependendo se estamos em localhost ou produção
    const url = window.location.hostname === 'localhost' 
      ? 'http://localhost:4242/create-checkout-session' // URL local para testes
      : '/.netlify/functions/create-checkout-session'; // URL para a função no Netlify
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
    alert('Erro ao processar o pagamento');
  }
}
