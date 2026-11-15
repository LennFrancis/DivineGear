let quantity = 1;

// Read the product ID from the URL and show its details.
function renderProductPage() {
	const box = document.getElementById("productDetail");
	const product = getProductById(getQueryParam("id"));
	if (!product) {
		box.innerHTML = '<div class="alert alert-danger">Product not found.</div>';
		return;
	}
	document.title = "DivineGear | " + product.name;
	const inStock = product.stock > 0;
	box.innerHTML = `
		<div class="detail-card row g-0">
			<div class="col-md-5"><img src="${product.image}" alt="${product.name}" /></div>
			<div class="col-md-7 detail-content">
				<span class="product-category">${product.category}</span>
				<h1>${product.name}</h1>
				<div class="product-rating">★ ${product.rating} Customer rating</div>
				<p class="detail-price">${money(product.price)}</p>
				<p class="detail-description">${product.description}</p>
				<div class="detail-stock ${inStock ? "" : "out"}">${inStock ? "✓ In stock: " + product.stock + " available" : "Out of stock"}</div>
				<div class="mb-3"><strong class="d-block mb-2">Quantity</strong>
					<div class="quantity-control"><button type="button" id="minusBtn" aria-label="Decrease quantity">−</button><span id="quantityText">1</span><button type="button" id="plusBtn" aria-label="Increase quantity">+</button></div></div>
				<div class="detail-subtotal"><span>Subtotal</span><strong id="subtotal">${money(product.price)}</strong></div>
				<div class="d-flex flex-wrap gap-2">
					<button class="btn btn-primary" type="button" id="addBtn" ${inStock ? "" : "disabled"}>Add to Cart</button>
					<button class="btn btn-light" type="button" id="buyBtn" ${inStock ? "" : "disabled"}>Buy Now</button>
				</div>
			</div>
		</div>
		<div class="product-extra row g-4">
			<div class="col-md-6"><h2>Product Description</h2><p>${product.description}</p></div>
			<div class="col-md-6"><h2>Product Information</h2>
				<div class="spec-row"><strong>Category</strong><span>${product.category}</span></div>
				<div class="spec-row"><strong>Stock</strong><span>${product.stock} available</span></div>
				<div class="spec-row"><strong>Rating</strong><span>★ ${product.rating}</span></div>
			</div>
		</div>`;

	// Keep the quantity within available stock and update the subtotal.
	function updateQuantity(newQuantity) {
		quantity = Math.max(1, Math.min(product.stock, newQuantity));
		document.getElementById("quantityText").textContent = quantity;
		document.getElementById("subtotal").textContent = money(product.price * quantity);
	}
	document
		.getElementById("minusBtn")
		.addEventListener("click", () => updateQuantity(quantity - 1));
	document
		.getElementById("plusBtn")
		.addEventListener("click", () => updateQuantity(quantity + 1));
	document
		.getElementById("addBtn")
		.addEventListener("click", () => addToCart(product.id, quantity));
	document.getElementById("buyBtn").addEventListener("click", () => {
		addToCart(product.id, quantity);
		openModal("cartModal");
	});
}

// Run this code only on the product details page.
if (document.getElementById("productDetail")) renderProductPage();
