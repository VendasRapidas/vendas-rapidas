// js/cart.js

// Adicionar produto ao carrinho
function adicionarAoCarrinho(produto) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  // Verifica se já existe o mesmo produto com a mesma cor
  const index = carrinho.findIndex(item => item.id === produto.id && item.cor === produto.cor);

  if (index !== -1) {
    carrinho[index].quantidade += 1;
  } else {
    carrinho.push({ ...produto, quantidade: 1 });
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  alert("Produto adicionado ao carrinho!");
}

// Obter todos os itens do carrinho
function obterCarrinho() {
  return JSON.parse(localStorage.getItem("carrinho")) || [];
}

// Limpar carrinho (após checkout ou botão "Esvaziar Carrinho")
function limparCarrinho() {
  localStorage.removeItem("carrinho");
}

// Renderizar o carrinho na página carrinho.html
function mostrarCarrinho() {
  const carrinho = obterCarrinho();
  const container = document.getElementById("carrinho");
  const totalSpan = document.getElementById("total");

  if (!container || !totalSpan) return;

  container.innerHTML = "";
  let total = 0;

  if (carrinho.length === 0) {
    container.innerHTML = "<p>O carrinho está vazio.</p>";
    totalSpan.textContent = "0.00 €";
    return;
  }

  carrinho.forEach((item, index) => {
    const subtotal = (item.price * item.quantidade) / 100;
    total += subtotal;

    const itemDiv = document.createElement("div");
    itemDiv.className = "item-carrinho";
    itemDiv.innerHTML = `
      <p><strong>${item.name}</strong> (${item.cor || "sem cor"})</p>
      <p>Quantidade: ${item.quantidade}</p>
      <p>Preço: ${(item.price / 100).toFixed(2)} €</p>
      <p>Subtotal: ${subtotal.toFixed(2)} €</p>
      <button onclick="removerDoCarrinho(${index})">Remover</button>
      <hr>
    `;
    container.appendChild(itemDiv);
  });

  totalSpan.textContent = `${total.toFixed(2)} €`;
}

// Remover item individual do carrinho
function removerDoCarrinho(index) {
  let carrinho = obterCarrinho();
  carrinho.splice(index, 1);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  mostrarCarrinho();
}

// Enviar para Stripe Checkout
async function pagarCarrinho() {
  const carrinho = obterCarrinho();
  if (carrinho.length === 0) {
    alert("O carrinho está vazio.");
    return;
  }

  try {
    const response = await fetch("/.netlify/functions/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: carrinho })
    });

    const data = await response.json();

    if (data.id) {
      window.location.href = `https://checkout.stripe.com/pay/${data.id}`;
    } else {
      alert("Erro ao criar sessão de pagamento.");
    }
  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    alert("Erro ao processar pagamento.");
  }
}
