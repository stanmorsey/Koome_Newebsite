let allProducts = [];

// Fetch products from JSON and store them in `allProducts`
async function fetchProducts() {
  try {
    const response = await fetch("assets/products/products.json");
    const products = await response.json();
    allProducts = products; // Store all products
    displayProducts(allProducts, document.getElementById("product-container"));
    populateCategoryFilters(allProducts); // Populate the category filter dynamically
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Display products dynamically
function displayProducts(products, container) {
  let productHTML = "";

  if (products.length === 0) {
    productHTML = "<p>No products available for this filter.</p>";
  } else {
    products.forEach((product) => {
      // WhatsApp message text, including product name, SKU, part number, and image link
      const whatsappMessage = encodeURIComponent(
        `Hi, I'm interested in ordering the product "${product.name}" (SKU: ${product.sku}). Could you please provide more details?\n\nProduct Part Number: ${product.part_number}\n\nProduct Image: ${product.image}`
      );

      // WhatsApp URL with the message
      const whatsappUrl = `https://wa.me/1234567890?text=${whatsappMessage}`; // Replace 1234567890 with the store's actual WhatsApp number

      productHTML += `
        <div class="pro">
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
        </div>
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
    document.getElementById("product-container")
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
    document.getElementById("product-container")
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
        document.getElementById("searchResults")
      );
    });
  }
});
