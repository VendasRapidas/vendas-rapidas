import stripe from './stripe.js';  // Importa a configuração do Stripe

async function checkout(name, price) {
  try {
    // Definir a URL dependendo de estarmos em desenvolvimento local ou produção
    const url = window.location.hostname === 'localhost'
      ? 'http://localhost:8888/.netlify/functions/create-checkout-session'  // URL para teste local
      : '/.netlify/functions/create-checkout-session';  // URL para a função serverless em produção

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, price }),  // Envia os dados do produto (nome e preço)
    });

    const data = await response.json();  // Resposta da função serverless

    if (data.id) {
      // Se a session ID for recebida, redireciona para o Stripe Checkout
      stripe.redirectToCheckout({ sessionId: data.id });
    } else {
      alert('Erro ao criar sessão de pagamento');
    }
  } catch (error) {
    console.error('Erro no checkout:', error);
    alert('Erro ao processar o pagamento');
  }
}

// Se quiseres usar o código do checkout em um evento de clique no botão
document.getElementById('checkout-button').addEventListener('click', function () {
  const productName = 'Produto Teste';  // Nome do produto
  const productPrice = 20;  // Preço em euros (substitui com o preço do teu produto)

  // Chama a função de checkout
  checkout(productName, productPrice);
});
