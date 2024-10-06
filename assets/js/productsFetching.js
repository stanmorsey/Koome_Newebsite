let allProducts = [];

// ============================Fetch products from JSON and store them in `allProducts`
async function fetchProducts() {
  try {
    const response = await fetch('./assets/products/products.json');
    const products = await response.json();
    allProducts = products; // Store all products
    shuffleArray(allProducts); // Shuffle the products
    displayProducts(allProducts);
    populateCategoryFilters(allProducts); // Populate the category filter dynamically
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// ============================Shuffle array function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// ============================Display products dynamically
function displayProducts(products) {
  const productContainer = document.getElementById('product-container');
  let productHTML = '';

  if (products.length === 0) {
    productHTML = '<p>No products available for this filter.</p>';
  } else {
    products.forEach(product => {
      productHTML += `
        <div class="pro" onclick="showProductDetail(${product.sku})">
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

// ============================Show product detail in modal
function showProductDetail(sku) {
  const product = allProducts.find(p => p.sku === sku);
  const productDetail = document.getElementById('product-detail');
  productDetail.innerHTML = `
    <h2>${product.name}</h2>
    <img src="${product.image}" alt="${product.name}">
    <p><strong>Price:</strong> ${product.price}</p>
    <p><strong>Brand:</strong> ${product.brand}</p>
    <p><strong>Category:</strong> ${product.category}</p>
    <p><strong>Description:</strong> ${product.description}</p>
    <p><strong>SKU:</strong> ${product.sku}</p>
    <p><strong>Part Number:</strong> ${product.part_number}</p>
    <p><strong>Alternate:</strong> ${product.alternate}</p>
    <p><strong>Weight:</strong> ${product.weight}</p>
    <p><strong>Dimensions:</strong> ${product.dimensions}</p>
    <p><strong>Material:</strong> ${product.material}</p>
    <p><strong>Manufacturer:</strong> ${product.manufacturer}</p>
    <p><strong>Origin:</strong> ${product.origin}</p>
    <p><strong>Warranty:</strong> ${product.warranty}</p>
    <p><strong>Availability:</strong> ${product.availability}</p>
    <p><strong>Rating:</strong> ${product.rating} ⭐</p>
    <p><strong>Tags:</strong> ${product.tags.join(', ')}</p>
    <p><strong>Technical Specs:</strong></p>
    <ul>
      <li><strong>Voltage:</strong> ${product.technical_specs.voltage}</li>
      <li><strong>Max Temp:</strong> ${product.technical_specs.max_temp}</li>
    </ul>
  `;

  const modal = document.getElementById('product-modal');
  modal.style.display = "block";
}

// Close the modal
document.querySelector('.close').addEventListener('click', () => {
  document.getElementById('product-modal').style.display = "none";
});

// Close the modal when clicking outside of it
window.addEventListener('click', (event) => {
  const modal = document.getElementById('product-modal');
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// ============================Populate the category filter based on product categories
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

// ============================Search products
function searchProducts(query) {
  const filteredProducts = allProducts.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase()) ||
    product.brand.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase())
  );

  displayProducts(filteredProducts);
}

// ============================Fetch products on page load
document.addEventListener('DOMContentLoaded', fetchProducts);

// ============================Event listener for category filter
document.getElementById('category-filter').addEventListener('change', (e) => {
  filterProducts(e.target.value);
});

// ============================Event listener for price filter
document.getElementById('price-filter').addEventListener('change', applyPriceFilter);

// ============================Event listener for search input
document.getElementById('search-input').addEventListener('input', (e) => {
  searchProducts(e.target.value);
});
