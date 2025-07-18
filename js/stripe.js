// stripe.js
// Inicializar Stripe com a tua chave pública real (chave pública sempre começa por pk_live_ ou pk_test_)
const stripe = Stripe("pk_live_51Rls9cCTAJQAvPL4M2VIWTBDXzUSLcTpR0z47iIluRGDSJ0XgUqEDtlJqlWplXXQi6VTOxImV9HteBIYiX8dOgyB00VDWG5w2t");

async function criarSessaoPagamento(product) {
  try {
    const response = await fetch("/.netlify/functions/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product }),
    });

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Erro: sessão de pagamento não criada.");
    }
  } catch (error) {
    console.error("Erro no pagamento:", error);
    alert("Erro ao tentar criar a sessão de pagamento.");
  }
}
