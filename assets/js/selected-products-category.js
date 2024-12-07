// Select the container to display products
const productsContainer = document.getElementById("products-container");

// Get the category slug from the URL
const params = new URLSearchParams(window.location.search);
const categorySlug = params.get("category");

const ITEMS_PER_PAGE = 20; // Limit to 20 items per page
let currentPage = 1; // Track the current page

if (!categorySlug) {
  productsContainer.innerHTML = "<p class='error-message'>Category not specified. Please return to the categories page.</p>";
} else {
  // Fetch JSON data from external file
  fetch("/assets/products/products.json")
    .then(response => {
      if (!response.ok) throw new Error("Failed to load JSON data.");
      return response.json();
    })
    .then(data => {
      displayProductsForCategory(data.menuTitles, categorySlug);
    })
    .catch(error => {
      console.error("Error fetching JSON data:", error);
      productsContainer.innerHTML = "<p class='error-message'>Error loading products. Please try again later.</p>";
    });
}

// Function to display products for a specific category with pagination
function displayProductsForCategory(menuData, categorySlug) {
  let foundCategory = null;

  // Find the category in the JSON data
  menuData.some(menu => {
    const category = menu.categories.find(cat => cat.slug === categorySlug);
    if (category) {
      foundCategory = category;
      return true;
    }
    return false;
  });

  if (!foundCategory) {
    productsContainer.innerHTML = "<p class='error-message'>Category not found. Please return to the categories page.</p>";
    return;
  }

  // Ensure grid and title elements exist
  let productsGrid = productsContainer.querySelector('.products-grid');
  let categoryTitle = productsContainer.querySelector('.category-title');

  if (!productsGrid) {
    productsGrid = document.createElement("div");
    productsGrid.className = "products-grid";
    productsContainer.appendChild(productsGrid);
  }

  if (!categoryTitle) {
    categoryTitle = document.createElement("h1");
    categoryTitle.className = "category-title";
    productsContainer.insertBefore(categoryTitle, productsGrid);
  }

  // Update the category title
  categoryTitle.textContent = foundCategory.name;

  // Clear previous product cards and pagination
  productsGrid.innerHTML = "";
  let paginationContainer = document.querySelector('.pagination-container');
  if (paginationContainer) {
    paginationContainer.remove();
  }

  // Adjust grid class for a single product
  if (foundCategory.items.length === 1) {
    productsGrid.classList.add("single-product");
  } else {
    productsGrid.classList.remove("single-product");
  }

  // Total items and pages
  const totalItems = foundCategory.items.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Get items for the current page
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, totalItems);
  const currentItems = foundCategory.items.slice(startIdx, endIdx);

  // Inject product cards into the grid
  if (currentItems.length > 0) {
    currentItems.forEach(item => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";
      productCard.innerHTML = `
        <div class="product-card-image">
          <img 
            src="${item.imageGallery?.[0]}" 
            alt="${item.name}" 
            onerror="this.src='/assets/img/skyjet-placeholder.png'"
          />
        </div>
        <div class="product-card-content">
          <h2 class="product-card-title">${item.name}</h2>
          <p class="product-card-price">Price: ${item.currency || ''} ${item.price}</p>
          <p class="product-card-part">Part Number: ${item.partNumber}</p>
        </div>
      `;

      // Add click event listener to redirect to the product details page
      productCard.addEventListener("click", () => {
        const productDetailsUrl = `/selected-product-details/selected-product-details.html?itemId=${item.itemId}`;
        window.location.href = productDetailsUrl;
      });

      productsGrid.appendChild(productCard);
    });
  } else {
    productsGrid.innerHTML = "<p class='error-message'>No products available in this category.</p>";
  }

  // Generate pagination
  generatePagination(totalPages, menuData, categorySlug);
}

function generatePagination(totalPages, menuData, categorySlug) {
  if (totalPages <= 1) return; // No pagination needed for a single page

  const paginationContainer = document.createElement("div");
  paginationContainer.className = "pagination-container";

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.className = "pagination-button";
    if (i === currentPage) {
      pageButton.classList.add("active");
    }
    pageButton.addEventListener("click", () => {
      currentPage = i; // Set current page
      displayProductsForCategory(menuData, categorySlug); // Reload products for the new page
    });
    paginationContainer.appendChild(pageButton);
  }

  productsContainer.appendChild(paginationContainer);
}

