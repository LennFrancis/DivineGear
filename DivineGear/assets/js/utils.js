// ---------- Helpers ----------
// Format a number as Philippine pesos.
function money(amount) {
	return "₱" + Number(amount).toLocaleString("en-PH");
}

// Read a value such as the product ID from the URL.
function getQueryParam(name) {
	return new URLSearchParams(window.location.search).get(name);
}

// Find a product using its ID.
function getProductById(id) {
	return products.find((product) => product.id === Number(id));
}

// Read the shopping cart saved in the browser.
function getCart() {
	return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart changes and refresh the cart count.
function saveCart(cart) {
	localStorage.setItem("cart", JSON.stringify(cart));
	updateCartCount();
}

// Add a product or increase its quantity in the cart.
function addToCart(id, quantity) {
	const product = getProductById(id);
	const cart = getCart();
	const item = cart.find((cartItem) => cartItem.id === id);
	if (item) item.quantity = Math.min(product.stock, item.quantity + quantity);
	else cart.push({ id: id, quantity: quantity });
	saveCart(cart);
	showToast(product.name + " added to cart.");
}

// Update the number shown on the cart button.
function updateCartCount() {
	const total = getCart().reduce((sum, item) => sum + item.quantity, 0);
	const badge = document.getElementById("cartCount");
	badge.textContent = total;
	badge.classList.toggle("d-none", total === 0);
}

// Display cart items and calculate the total price.
function renderCart() {
	const cart = getCart();
	const box = document.getElementById("cartItems");
	let total = 0;
	box.innerHTML = cart.length === 0 ? '<p class="text-center text-muted">Your cart is empty.</p>' : cart.map((item) => {
		const product = getProductById(item.id);
		total += product.price * item.quantity;
		return `<div class="cart-row">
			<img src="${product.image}" alt="${product.name}" />
			<div class="info"><strong>${product.name}</strong><br /><small>Qty: ${item.quantity}</small></div>
			<strong>${money(product.price * item.quantity)}</strong>
			<button type="button" class="btn-close" aria-label="Remove" data-remove="${item.id}"></button>
		</div>`;
	}).join("");
	document.getElementById("cartTotal").textContent = money(total);
	box.querySelectorAll("[data-remove]").forEach((button) => {
		button.addEventListener("click", () => {
			saveCart(getCart().filter((item) => item.id !== Number(button.dataset.remove)));
			renderCart();
		});
	});
}

// Show a short message after an action.
function showToast(message) {
	const toast = document.getElementById("toast");
	toast.textContent = message;
	toast.classList.add("show");
	setTimeout(() => toast.classList.remove("show"), 2200);
}

// Open a Bootstrap modal by its ID.
function openModal(id) {
	const element = document.getElementById(id);
	const modal = bootstrap.Modal.getInstance(element) || new bootstrap.Modal(element);
	modal.show();
}

// Close a Bootstrap modal by its ID.
function closeModal(id) {
	const element = document.getElementById(id);
	const modal = bootstrap.Modal.getInstance(element);
	if (modal) modal.hide();
}

function switchModal(fromId, toId) {
    document.getElementById(fromId).addEventListener(
        "hidden.bs.modal",
        () => openModal(toId),
        { once: true }
    );
    closeModal(fromId);
}

// Connect the search form and shopping cart buttons.
function setupSiteControls() {
	document.getElementById("searchForm").addEventListener("submit", (event) => {
		event.preventDefault();
		const query = document.getElementById("searchInput").value.trim();
		window.location.href = "products.html" + (query ? "?search=" + encodeURIComponent(query) : "");
	});
	document.getElementById("cartBtn").addEventListener("click", () => openModal("cartModal"));
	document.getElementById("cartModal").addEventListener("show.bs.modal", renderCart);
	document.getElementById("clearCartBtn").addEventListener("click", () => {
		saveCart([]);
		renderCart();
	});
}

setupSiteControls();
