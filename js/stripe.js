// js/stripe.js
document.getElementById("finalizar-compra").addEventListener("click", async () => {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

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

        if (data.url) {
            window.location.href = data.url; // Redireciona para Stripe Checkout
        } else {
            alert("Erro ao redirecionar para o pagamento.");
            console.error("Erro Stripe:", data);
        }
    } catch (error) {
        console.error("Erro na chamada ao backend:", error);
        alert("Erro inesperado. Verifica a consola.");
    }
});
