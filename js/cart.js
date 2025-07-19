// js/cart.js

// Adicionar produto ao carrinho
function adicionarAoCarrinho(produto) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  // Verifica se já existe o produto no carrinho
  const index = carrinho.findIndex(item => item.id === produto.id);
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

// Limpar carrinho (usar após checkout ou botão "Esvaziar Carrinho")
function limparCarrinho() {
  localStorage.removeItem("carrinho");
}
