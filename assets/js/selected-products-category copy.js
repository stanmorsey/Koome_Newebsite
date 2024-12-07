// Select the container to display products
const productsContainer = document.getElementById("products-container");
const sortOptions = document.getElementById("sort-options");

// Get the category slug from the URL
const params = new URLSearchParams(window.location.search);
const categorySlug = params.get("category");

const ITEMS_PER_PAGE = 20; // Limit to 20 items per page
let currentPage = 1; // Track the current page
let currentSort = "default"; // Track current sort option

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
      const menuData = data.menuTitles;
      sortOptions.addEventListener("change", () => {
        currentSort = sortOptions.value;
        currentPage = 1; // Reset to the first page on sorting
        displayProductsForCategory(menuData, categorySlug);
      });
      displayProductsForCategory(menuData, categorySlug);
    })
    .catch(error => {
      console.error("Error fetching JSON data:", error);
      productsContainer.innerHTML = "<p class='error-message'>Error loading products. Please try again later.</p>";
    });
}

// Function to sort products based on selected criteria
function sortProducts(items, sortOption) {
  switch (sortOption) {
    case "price-asc":
      return items.sort((a, b) => a.price - b.price);
    case "price-desc":
      return items.sort((a, b) => b.price - a.price);
    case "name-asc":
      return items.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return items.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return items; // Default order
  }
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

  const productsGrid = productsContainer.querySelector('.products-grid');
  const categoryTitle = productsContainer.querySelector('.category-title');

  // Update the category title
  categoryTitle.textContent = foundCategory.name;

  // Clear previous product cards and pagination
  productsGrid.innerHTML = "";
  const paginationContainer = document.querySelector('.pagination-container');
  if (paginationContainer) {
    paginationContainer.innerHTML = "";
  }

  // Sort items based on the current sort option
  const sortedItems = sortProducts([...foundCategory.items], currentSort);

  // Total items and pages
  const totalItems = sortedItems.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Get items for the current page
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, totalItems);
  const currentItems = sortedItems.slice(startIdx, endIdx);

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
  if (totalPages <= 1) return;

  const paginationContainer = document.querySelector('.pagination-container');

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
}
