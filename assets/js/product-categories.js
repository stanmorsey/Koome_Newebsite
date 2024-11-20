let allProducts = [];
let currentPage = 1;
const productsPerPage = 20;

// Fetch products from JSON and store them in `allProducts`
async function fetchProducts(category) {
  try {
    const response = await fetch("/assets/products/products.json");
    const products = await response.json();

    allProducts = category
      ? products.filter((product) => product.category === category)
      : products; // Show all if no category
    shuffleArray(allProducts); // Shuffle the products
    displayProducts(allProducts, document.getElementById("product-container"), currentPage);
    populateFilters(allProducts); // Populate the filters dynamically
  } catch (error) {
    console.error("Error fetching products:", error);
    document.getElementById("product-container").innerHTML =
      "<p>Failed to load products. Please try again later.</p>";
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
    productHTML = "<p>No products available.</p>";
  } else {
    paginatedProducts.forEach((product) => {
      const priceWithCurrency = product.currency
        ? `${product.currency} ${product.price}`
        : "Price not available";

      const whatsappMessage = encodeURIComponent(
        `Hi, I'm interested in ordering the product "${product.name}" (SKU: ${product.sku}). Could you please provide more details?\n\nProduct Part Number: ${product.part_number}\n\nProduct Image: ${product.image}`
      );
      const whatsappUrl = `https://wa.me/254113015069?text=${whatsappMessage}`;

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
            <p class="product-part-number"><strong>Part Number:</strong> ${product.part_number || "N/A"}</p>
            <button class="btn view-more" data-sku="${product.sku}">More Details</button>
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

  // Pagination controls
  const paginationControls = `
    <div class="pagination">
      <button onclick="changePage(-1)" ${page === 1 ? "disabled" : ""}>Previous</button>
      <span>Page ${page} of ${Math.ceil(products.length / productsPerPage)}</span>
      <button onclick="changePage(1)" ${end >= products.length ? "disabled" : ""}>Next</button>
    </div>
  `;
  container.insertAdjacentHTML("beforeend", paginationControls);
}

// Change page function
function changePage(direction) {
  currentPage += direction;
  displayProducts(allProducts, document.getElementById("product-container"), currentPage);
}

// Populate filters dynamically
function populateFilters(products) {
  const categories = [...new Set(products.map((product) => product.category).filter(Boolean))];
  const brands = [...new Set(products.map((product) => product.brand).filter(Boolean))];

  populateFilterSection("category", categories);
  populateFilterSection("brand", brands);
}

// Populate individual filter section
function populateFilterSection(filterId, items) {
  const filterContent = document.getElementById(filterId);
  if (!filterContent) return;

  const filterHTML = items
    .map(
      (item) => `
        <label>
          <input type="checkbox" value="${item}" onchange="filterProducts()">
          ${item}
        </label>
      `
    )
    .join("");

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

  displayProducts(filteredProducts, document.getElementById("product-container"), currentPage);
}

// Get selected filter values
function getSelectedFilterValues(filterId) {
  const checkboxes = document.querySelectorAll(`#${filterId} input[type="checkbox"]:checked`);
  return Array.from(checkboxes).map((checkbox) => checkbox.value);
}

// Fetch products on page load
document.addEventListener("DOMContentLoaded", () => fetchProducts());
