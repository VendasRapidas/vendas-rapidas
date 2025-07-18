// checkout.js
const stripe = Stripe('pk_live_51Rls9cCTAJQAvPL4M2VIWTBDXzUSLcTpR0z47iIluRGDSJ0XgUqEDtlJqlWplXXQi6VTOxImV9HteBIYiX8dOgyB00VDWG5w2t'); // Chave pública

async function checkout(name, price) {
  try {
    // Verifica a URL dependendo se estamos em produção ou local
    const url = window.location.hostname === 'localhost' 
      ? 'http://localhost:4242/create-checkout-session'  // Para testes locais
      : '/.netlify/functions/create-checkout-session';  // Para produção (Netlify)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, price }),  // Envia o nome e preço para o backend
    });

    const data = await response.json();

    if (data.id) {
      // Redireciona para o checkout da Stripe usando a session ID recebida
      stripe.redirectToCheckout({ sessionId: data.id });
    } else {
      alert('Erro ao criar sessão de pagamento');
    }
  } catch (error) {
    console.error('Erro no checkout:', error);
    alert('Erro ao processar o pagamento');
  }
}
