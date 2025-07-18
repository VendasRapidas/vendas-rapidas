// Inicializar Stripe com a tua chave pública (coloca a tua chave real)
const stripe = Stripe("pk_live_51Rls9cCTAJQAvPL4M2VIWTBDXzUSLcTpR0z47iIluRGDSJ0XgUqEDtlJqlWplXXQi6VTOxImV9HteBIYiX8dOgyB00VDWG5w2t");

async function criarSessaoPagamento(product) {
  try {
    const response = await fetch("http://localhost:4242/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product }),
    });
    
    const data = await response.json();

    if (data.url) {
      // Redireciona para a URL da sessão de checkout
      window.location.href = data.url;
    } else {
      alert("Erro: sessão de pagamento não criada.");
    }
  } catch (error) {
    console.error("Erro no pagamento:", error);
    alert("Erro ao tentar criar a sessão de pagamento.");
  }
}
