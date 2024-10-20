let allProducts = [];
let currentPage = 1;
const productsPerPage = 20;

// Fetch products from JSON and store them in `allProducts`
async function fetchProducts(category) {
  try {
    const response = await fetch("/assets/products/products.json");
    const products = await response.json();
    allProducts = products.filter(product => product.category === category); // Filter products by category
    shuffleArray(allProducts); // Shuffle the products
    displayProducts(allProducts, document.getElementById("product-container"), currentPage);
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
    productHTML = "<p>No products available.</p>";
  } else {
    paginatedProducts.forEach((product) => {
      // WhatsApp message text, including product name, SKU, part number, and image link
      const whatsappMessage = encodeURIComponent(
        `Hi, I'm interested in ordering the product "${product.name}" (SKU: ${product.sku}). Could you please provide more details?\n\nProduct Part Number: ${product.part_number}\n\nProduct Image: ${product.image}`
      );

      // WhatsApp URL with the message
      const whatsappUrl = `https://wa.me/254113015069?text=${whatsappMessage}`;

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

// Toggle filter sections
function toggleFilter(filterId) {
  const filterContent = document.getElementById(filterId);
  const filterButton = filterContent.previousElementSibling;

  if (filterContent.style.display === "none" || filterContent.style.display === "") {
    filterContent.style.display = "block";
    filterButton.textContent = filterButton.textContent.replace("+", "-");
  } else {
    filterContent.style.display = "none";
    filterButton.textContent = filterButton.textContent.replace("-", "+");
  }
}

// Populate filters dynamically
function populateFilters(products) {
  const categories = [...new Set(products.map(product => product.category))];
  const brands = [...new Set(products.map(product => product.brand))];
  const series = [...new Set(products.map(product => product.series))];
  const materials = [...new Set(products.map(product => product.material))];
  const sizes = [...new Set(products.map(product => product.size))];
  const specs = [...new Set(products.map(product => product.spec))];
  const colors = [...new Set(products.map(product => product.color))];

  populateFilterSection('category', categories);
  populateFilterSection('brand', brands);
  populateFilterSection('series', series);
  populateFilterSection('material', materials);
  populateFilterSection('size', sizes);
  populateFilterSection('spec', specs);
  populateFilterSection('color', colors);
}

// Populate individual filter section
function populateFilterSection(filterId, items) {
  const filterContent = document.getElementById(filterId);
  let filterHTML = "";
  items.forEach(item => {
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
  const selectedCategories = getSelectedFilterValues('category');
  const selectedBrands = getSelectedFilterValues('brand');
  const selectedSeries = getSelectedFilterValues('series');
  const selectedMaterials = getSelectedFilterValues('material');
  const selectedSizes = getSelectedFilterValues('size');
  const selectedSpecs = getSelectedFilterValues('spec');
  const selectedColors = getSelectedFilterValues('color');

  let filteredProducts = allProducts;

  if (selectedCategories.length > 0) {
    filteredProducts = filteredProducts.filter(product => selectedCategories.includes(product.category));
  }
  if (selectedBrands.length > 0) {
    filteredProducts = filteredProducts.filter(product => selectedBrands.includes(product.brand));
  }
  if (selectedSeries.length > 0) {
    filteredProducts = filteredProducts.filter(product => selectedSeries.includes(product.series));
  }
  if (selectedMaterials.length > 0) {
    filteredProducts = filteredProducts.filter(product => selectedMaterials.includes(product.material));
  }
  if (selectedSizes.length > 0) {
    filteredProducts = filteredProducts.filter(product => selectedSizes.includes(product.size));
  }
  if (selectedSpecs.length > 0) {
    filteredProducts = filteredProducts.filter(product => selectedSpecs.includes(product.spec));
  }
  if (selectedColors.length > 0) {
    filteredProducts = filteredProducts.filter(product => selectedColors.includes(product.color));
  }

  displayProducts(filteredProducts, document.getElementById("product-container"), currentPage);
}

// Get selected filter values
function getSelectedFilterValues(filterId) {
  const checkboxes = document.querySelectorAll(`#${filterId} input[type="checkbox"]:checked`);
  return Array.from(checkboxes).map(checkbox => checkbox.value);
}

// Toggle filters on mobile
function toggleFilters() {
  var sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('show');
}

// Fetch products on page load
document.addEventListener("DOMContentLoaded", () => fetchProducts('desiredCategory'));
