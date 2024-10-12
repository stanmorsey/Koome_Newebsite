let allProducts = [];
let currentPage = 1;
const productsPerPage = 20;

// Fetch products from JSON and store them in `allProducts`
async function fetchProducts() {
  try {
    const response = await fetch("/assets/products/products.json");
    const products = await response.json();
    allProducts = products; // Store all products
    shuffleArray(allProducts); // Shuffle the products
    displayProducts(allProducts, document.getElementById("product-container"), currentPage);
    populateCategoryFilters(allProducts); // Populate the category filter dynamically
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Shuffle array function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Display products dynamically with pagination
function displayProducts(products, container, page) {
  let productHTML = "";
  const start = (page - 1) * productsPerPage;
  const end = start + productsPerPage;
  const paginatedProducts = products.slice(start, end);

  if (paginatedProducts.length === 0) {
    productHTML = "<p>No products available for this filter.</p>";
  } else {
    paginatedProducts.forEach((product) => {
      // WhatsApp message text, including product name, SKU, part number, and image link
      const whatsappMessage = encodeURIComponent(
        `Hi, I'm interested in ordering the product "${product.name}" (SKU: ${product.sku}). Could you please provide more details?\n\nProduct Part Number: ${product.part_number}\n\nProduct Image: ${product.image}`
      );

      // WhatsApp URL with the message
      const whatsappUrl = `https://wa.me/254113015069?text=${whatsappMessage}`;

      productHTML += `
        <a href="/product-details/product-details.html?sku=${product.sku}" class="pro">
          <img src="${product.image}" alt="${product.name}" onerror="this.src='/assets/img/skyjet-placeholder.png'">
          <div class="des">
            <h5>${product.name}</h5>
            <h4>${product.price}</h4>
            <p>${product.description ? product.description : 'No description available'}</p> <!-- Show description -->
            <p><strong>Part Number:</strong> ${product.part_number}</p> <!-- Show part number -->

            <!-- More Details Button -->
            <button class="view-more" data-sku="${product.sku}">More Details</button>

            <!-- WhatsApp Order Button -->
            <a href="${whatsappUrl}" target="_blank" class="order-whatsapp">
              <img src="/assets/img/logoFaviconIcon/whatsapp.png" alt="WhatsApp Icon"> Order on WhatsApp
            </a>
          </div>
        </a>
      `;
    });
  }

  container.innerHTML = productHTML;

  // Event listeners to "View More" buttons
  document.querySelectorAll(".view-more").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productSku = event.target.getAttribute("data-sku");
      window.location.href = `/product-details/product-details.html?sku=${productSku}`;
    });
  });

  // Pagination controls
  const paginationControls = `
    <div class="pagination">
      <button onclick="changePage(-1)" ${page === 1 ? 'disabled' : ''}>Previous</button>
      <span>Page ${page} of ${Math.ceil(products.length / productsPerPage)}</span>
      <button onclick="changePage(1)" ${end >= products.length ? 'disabled' : ''}>Next</button>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', paginationControls);
}

// Change page function
function changePage(direction) {
  currentPage += direction;
  displayProducts(allProducts, document.getElementById("product-container"), currentPage);
}

// Populate the category filter based on product categories
function populateCategoryFilters(products) {
  const categoryFilter = document.getElementById("category-filter");
  const categories = [...new Set(products.map((product) => product.category))];

  let categoryHTML = `<option value="All">All Categories</option>`;
  categories.forEach((category) => {
    categoryHTML += `<option value="${category}">${category}</option>`;
  });

  categoryFilter.innerHTML = categoryHTML;
}

// Filter by category
function filterProducts(category) {
  let filteredProducts = allProducts;

  if (category !== "All") {
    filteredProducts = allProducts.filter(
      (product) => product.category === category
    );
  }

  displayProducts(
    filteredProducts,
    document.getElementById("product-container"),
    currentPage
  );
}

// Apply price filter
function applyPriceFilter() {
  const priceFilter = document.getElementById("price-filter").value;
  let filteredProducts = allProducts;

  if (priceFilter === "low") {
    filteredProducts = allProducts.filter(
      (product) => parseInt(product.price.replace("$", "")) < 5000
    );
  } else if (priceFilter === "medium") {
    filteredProducts = allProducts.filter(
      (product) =>
        parseInt(product.price.replace("$", "")) >= 5000 &&
        parseInt(product.price.replace("$", "")) <= 15000
    );
  } else if (priceFilter === "high") {
    filteredProducts = allProducts.filter(
      (product) => parseInt(product.price.replace("$", "")) > 15000
    );
  }

  displayProducts(
    filteredProducts,
    document.getElementById("product-container"),
    currentPage
  );
}

// Search products and redirect to search results page
function searchProducts() {
  const query = document.getElementById("searchInput").value;
  window.location.href = `../search-results/search-results.html?query=${encodeURIComponent(
    query
  )}`;
}

// Fetch products on page load
document.addEventListener("DOMContentLoaded", fetchProducts);

// Event listener for category filter
document.getElementById("category-filter").addEventListener("change", (e) => {
  filterProducts(e.target.value);
});

// Event listener for price filter
document
  .getElementById("price-filter")
  .addEventListener("change", applyPriceFilter);

// Handle search results on search-results.html
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("query");

  if (query) {
    fetchProducts().then(() => {
      const filteredProducts = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.brand.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          product.part_number.toLowerCase().includes(query.toLowerCase())
      );

      displayProducts(
        filteredProducts,
        document.getElementById("searchResults"),
        currentPage
      );
    });
  }
});
