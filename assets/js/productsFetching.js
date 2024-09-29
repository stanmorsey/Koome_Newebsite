let allProducts = [];

// Fetch products from JSON and store them in `allProducts`
async function fetchProducts() {
  try {
    const response = await fetch('./assets/products/products.json');
    const products = await response.json();
    allProducts = products; // Store all products
    displayProducts(allProducts);
    populateCategoryFilters(allProducts); // Populate the category filter dynamically
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Display products dynamically
function displayProducts(products) {
  const productContainer = document.getElementById('product-container');
  let productHTML = '';

  if (products.length === 0) {
    productHTML = '<p>No products available for this filter.</p>';
  } else {
    products.forEach(product => {
      productHTML += `
        <div class="pro">
          <img src="${product.image}" alt="${product.name}">
          <div class="des">
            <h5>${product.name}</h5>
            <h4>${product.price}</h4>
            <p>${product.description}</p> <!-- Show description -->
            <p><strong>Brand:</strong> ${product.brand}</p>
            <p><strong>Category:</strong> ${product.category}</p>
            <p><strong>Rating:</strong> ${product.rating} ⭐</p>
          </div>
        </div>
      `;
    });
  }

  productContainer.innerHTML = productHTML;
}

// Populate the category filter based on product categories
function populateCategoryFilters(products) {
  const categoryFilter = document.getElementById('category-filter');
  const categories = [...new Set(products.map(product => product.category))]; // Unique categories

  let categoryHTML = `<option value="All">All Categories</option>`;
  categories.forEach(category => {
    categoryHTML += `<option value="${category}">${category}</option>`;
  });

  categoryFilter.innerHTML = categoryHTML;
}

// Filter by category
function filterProducts(category) {
  let filteredProducts = allProducts;

  if (category !== 'All') {
    filteredProducts = allProducts.filter(product => product.category === category);
  }

  displayProducts(filteredProducts);
}

// Apply price filter
function applyPriceFilter() {
  const priceFilter = document.getElementById('price-filter').value;
  let filteredProducts = allProducts;

  if (priceFilter === 'low') {
    filteredProducts = allProducts.filter(product => parseInt(product.price.replace('Ksh.', '')) < 5000);
  } else if (priceFilter === 'medium') {
    filteredProducts = allProducts.filter(product => parseInt(product.price.replace('Ksh.', '')) >= 5000 && parseInt(product.price.replace('Ksh.', '')) <= 15000);
  } else if (priceFilter === 'high') {
    filteredProducts = allProducts.filter(product => parseInt(product.price.replace('Ksh.', '')) > 15000);
  }

  displayProducts(filteredProducts);
}

// Fetch products on page load
document.addEventListener('DOMContentLoaded', fetchProducts);

// Event listener for category filter
document.getElementById('category-filter').addEventListener('change', (e) => {
  filterProducts(e.target.value);
});

// Event listener for price filter
document.getElementById('price-filter').addEventListener('change', applyPriceFilter);
