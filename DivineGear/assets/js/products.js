// Labels for the product category buttons.
const categoryNames = {
	All: "All Products",
	Keyboard: "Keyboards",
	Mouse: "Mice",
	Monitor: "Monitors",
	Controller: "Controllers",
	Headset: "Headsets",
};
let activeCategory = "All";

// Build one product card from the product data.
function createProductCard(product) {
	return `
		<div class="col">
			<div class="card product-card">
				<img src="${product.image}" alt="${product.name}" />
				<div class="product-info">
					<span class="product-category">${product.category}</span>
					<h3 class="product-name">${product.name}</h3>
					<p class="product-desc">${product.description}</p>
					<div class="product-bottom"><span class="product-price">${money(product.price)}</span><span class="product-rating">★ ${product.rating}</span></div>
					<a class="btn btn-primary w-100" href="product.html?id=${product.id}">View Details</a>
				</div>
			</div>
		</div>`;
}
// Display the products and update the result count.
function renderProducts(list) {
	document.getElementById("productGrid").innerHTML = list.map(createProductCard).join("");
	document.getElementById("productTotal").textContent = list.length + " Products Available";
	document.getElementById("noResults").classList.toggle("d-none", list.length > 0);

	animateProductCards();
}

// Filter products using the selected category and search text.
function filterProducts() {
	const search = (getQueryParam("search") || "").toLowerCase();
	const list = products.filter(product => {
		const inCategory = activeCategory === "All" || product.category === activeCategory;
		const text = (
			product.name +
			" " +
			product.category +
			" " +
			product.description
		).toLowerCase();
		return inCategory && text.includes(search);
	});
	renderProducts(list);
}
// Simulates a short loading time using a Promise.
function wait(milliseconds) {
	return new Promise(resolve => {
		setTimeout(resolve, milliseconds);
	});
}

// Loads the products asynchronously.
async function loadProducts() {
	const grid = document.getElementById("productGrid");

	grid.innerHTML = '<p class="text-center">Loading products...</p>';

	await wait(500);

	setupProductsPage();
}

// Create category buttons and connect their click events.
function setupProductsPage() {
	const categories = ["All", ...new Set(products.map(product => product.category))];
	const list = document.getElementById("categoryList");
	list.innerHTML = categories
		.map(
			category =>
				`<button type="button" class="category-link ${category === activeCategory ? "active" : ""}" data-category="${category}">${categoryNames[category]}</button>`,
		)
		.join("");
	list.querySelectorAll("button").forEach(button => {
		button.addEventListener("click", () => {
			activeCategory = button.dataset.category;
			list.querySelectorAll("button").forEach(b =>
				b.classList.toggle("active", b === button),
			);
			filterProducts();
		});
	});
	document.getElementById("searchInput").value = getQueryParam("search") || "";
	filterProducts();
}

// Display selected products on the home page.
function renderFeatured() {
	const featuredIds = [9, 1, 3];
	document.getElementById("featuredGrid").innerHTML = featuredIds.map(getProductById).map((product) => `
		<div class="col-12 col-sm-4">
			<a class="featured-item" href="product.html?id=${product.id}">
				<img src="${product.image}" alt="${product.name}" />
				<strong>${product.name}</strong><small>${product.category}</small>
			</a>
		</div>`).join("");
	animateProductCards();
}

// Run only the product section available on the current page.
if (document.getElementById("featuredGrid")) renderFeatured();
if (document.getElementById("productGrid")) loadProducts();
