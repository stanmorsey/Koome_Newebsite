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
    populateFilters(allProducts); // Populate the filters dynamically
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Reusable function to format price with currency
function formatPrice(product) {
  return `${product.currency || "USD"} ${product.price || "N/A"}`;
}

// Shuffle array function (optional: can disable randomization)
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
    productHTML = "<p>No products available matching your criteria.</p>";
  } else {
    paginatedProducts.forEach((product) => {
      // WhatsApp message text, including product name, SKU, part number, and image link
      const whatsappMessage = encodeURIComponent(
        `Hi, I'm interested in ordering the product "${product.name || "N/A"}" (SKU: ${product.sku || "N/A"}). Could you please provide more details?\n\nProduct Part Number: ${product.part_number || "N/A"}\n\nProduct Image: ${product.image || "N/A"}`
      );

      // WhatsApp URL with the message
      const whatsappUrl = `https://wa.me/254113015069?text=${whatsappMessage}`;

      productHTML += `
        <div class="pro">
          <img src="${product.image}" alt="${product.name || "Product Image"}" onerror="this.src='/assets/img/skyjet-placeholder.png'">
          <div class="des">
            <h5>${product.name || "No Name Available"}</h5>
            <h4>${formatPrice(product)}</h4>
            <p>${product.description || "No description available"}</p>
            <p><strong>Part Number:</strong> ${product.part_number || "N/A"}</p>

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

  // Event delegation for "View More" buttons
  container.addEventListener("click", (event) => {
    if (event.target.classList.contains("view-more")) {
      const productSku = event.target.getAttribute("data-sku");
      window.location.href = `/product-details/product-details.html?sku=${productSku}`;
    }
  });

  // Pagination controls
  const totalPages = Math.ceil(products.length / productsPerPage);
  const paginationControls = `
    <div class="pagination">
      <button onclick="changePage(-1)" ${page === 1 ? "disabled" : ""}>Previous</button>
      <span>Page ${page} of ${totalPages}</span>
      <button onclick="changePage(1)" ${end >= products.length ? "disabled" : ""}>Next</button>
    </div>
  `;
  container.insertAdjacentHTML("beforeend", paginationControls);
}

// Change page function with edge case guards
function changePage(direction) {
  const totalPages = Math.ceil(allProducts.length / productsPerPage);
  if ((direction === -1 && currentPage === 1) || (direction === 1 && currentPage >= totalPages)) return;
  currentPage += direction;
  displayProducts(allProducts, document.getElementById("product-container"), currentPage);
}

// Populate filters dynamically and update based on selections
function populateFilters(products) {
  const categories = [...new Set(products.map((product) => product.category))];
  const brands = [...new Set(products.map((product) => product.brand))];
  // Additional filter options can be added here...

  updateFilterSection("category", categories);
  updateFilterSection("brand", brands);
}

// Update filter options dynamically
function updateFilterSection(filterId, items) {
  const filterContent = document.getElementById(filterId);
  let filterHTML = "";
  items.forEach((item) => {
    filterHTML += `
      <label>
        <input type="checkbox" value="${item}" onchange="filterProducts()">
        ${item}
      </label>
    `;
  });
  filterContent.innerHTML = filterHTML;
}

// Filter products based on selected filters
function filterProducts() {
  const selectedCategories = getSelectedFilterValues("category");
  const selectedBrands = getSelectedFilterValues("brand");

  let filteredProducts = allProducts;

  if (selectedCategories.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      selectedCategories.includes(product.category)
    );
  }
  if (selectedBrands.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      selectedBrands.includes(product.brand)
    );
  }

  // Update filters dynamically based on remaining products
  updateFilters(filteredProducts);

  displayProducts(filteredProducts, document.getElementById("product-container"), currentPage);
}

// Update filters based on filtered products
function updateFilters(products) {
  populateFilters(products);
}

// Get selected filter values
function getSelectedFilterValues(filterId) {
  const checkboxes = document.querySelectorAll(`#${filterId} input[type="checkbox"]:checked`);
  return Array.from(checkboxes).map((checkbox) => checkbox.value);
}

// Toggle filters on mobile
function toggleFilters() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("show");
}

// Fetch products on page load
document.addEventListener("DOMContentLoaded", fetchProducts);
