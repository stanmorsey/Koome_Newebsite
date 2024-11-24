let allProducts = [];
let currentPage = 1;
const productsPerPage = 20;

// Fetch products from JSON and store them in allProducts
async function fetchProducts() {
  try {
    const response = await fetch("/assets/products/products.json");
    const products = await response.json();
    allProducts = products; // Store all products
    shuffleArray(allProducts); // Shuffle the products
    displayProducts(
      allProducts,
      document.getElementById("product-container"),
      currentPage
    );
    renderPagination(allProducts.length); // Render page numbers
    populateFilters(allProducts); // Populate the filters dynamically
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
    productHTML = "<p class='no-products-message'>No products available.</p>";
  } else {
    paginatedProducts.forEach((product) => {
      const priceWithCurrency = `${product.currency || "USD"} ${
        product.price || "N/A"
      }`;
      const whatsappMessage = encodeURIComponent(
        `Hi, I'm interested in ordering the product "${product.name}" (SKU: ${product.sku}). Could you please provide more details?\n\nProduct Part Number: ${product.part_number}\n\nProduct Image: ${product.image}`
      );
      const whatsappUrl = `https://wa.me/254796962055?text=${whatsappMessage}`;

      productHTML += `
        <div class="product-card">
          <img 
            src="${product.image}" 
            alt="${product.name}" 
            class="product-image" 
            onerror="this.src='/assets/img/skyjet-placeholder.png'"
          >
          <div class="product-details">
            <h5 class="product-name">${product.name}</h5>
            <h4 class="product-price">${priceWithCurrency}</h4>
            <p class="product-part-number"><strong>Part Number:</strong> ${
              product.part_number || "N/A"
            }</p>
            <button class="btn view-more" data-sku="${
              product.sku
            }">More Details</button>
            <a 
              href="${whatsappUrl}" 
              target="_blank" 
              class="btn order-whatsapp"
            >
              <img src="/assets/img/logoFaviconIcon/whatsapp.png" alt="WhatsApp Icon" class="whatsapp-icon"> Order on WhatsApp
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

// Render Pagination with Limited Page Numbers
function renderPagination(totalProducts) {
  const paginationContainer = document.getElementById("pagination-container");
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const maxVisiblePages = 4; // Number of pages to show at a time
  let paginationHTML = "";

  // Previous Button
  paginationHTML += `
    <button 
      class="page-button prev" 
      onclick="changePage(currentPage - 1)" 
      ${currentPage === 1 ? "disabled" : ""}>
      &lt;
    </button>
  `;

  // Calculate visible page range
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
      <button 
        class="page-button ${i === currentPage ? "active" : ""}" 
        onclick="changePage(${i})">
        ${i}
      </button>
    `;
  }

  // Next Button
  paginationHTML += `
    <button 
      class="page-button next" 
      onclick="changePage(currentPage + 1)" 
      ${currentPage === totalPages ? "disabled" : ""}>
      &gt;
    </button>
  `;

  paginationContainer.innerHTML = paginationHTML;
}

// Change page function
function changePage(pageNumber) {
  const totalPages = Math.ceil(allProducts.length / productsPerPage);

  if (pageNumber > 0 && pageNumber <= totalPages) {
    currentPage = pageNumber;
    displayProducts(
      allProducts,
      document.getElementById("product-container"),
      currentPage
    );
    renderPagination(allProducts.length); // Update pagination buttons
  }
}

// Toggle filters on mobile
function toggleFilters() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("show");
}

// Fetch products on page load
document.addEventListener("DOMContentLoaded", fetchProducts);
