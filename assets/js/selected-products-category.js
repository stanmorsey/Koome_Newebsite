// Select the container to display products
const productsContainer = document.getElementById("products-container");

// Get the category slug from the URL
const params = new URLSearchParams(window.location.search);
const categorySlug = params.get("category");

if (!categorySlug) {
  productsContainer.innerHTML = "<p>Category not specified. Please return to the categories page.</p>";
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
      productsContainer.innerHTML = "<p>Error loading products. Please try again later.</p>";
    });
}

// Function to display products for a specific category
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
    productsContainer.innerHTML = "<p>Category not found. Please return to the categories page.</p>";
    return;
  }

  // Display the category products
  productsContainer.innerHTML = `<h1>${foundCategory.name}</h1>`;

  if (foundCategory.items && foundCategory.items.length > 0) {
    foundCategory.items.forEach(item => {
      const productCard = document.createElement("div");
      productCard.className = "card";
      productCard.innerHTML = `
        <img 
          src="${item.imageGallery?.[0]}" 
          alt="${item.name}" 
          onerror="this.src='/assets/img/skyjet-placeholder.png'"
        />
        <h2>${item.name}</h2>
        <p>Price: ${item.price}</p>
        <p>Part Number: ${item.partNumber}</p>
      `;
      // Add click event listener to redirect to the product details page
      productCard.addEventListener("click", () => {
        const productDetailsUrl = `/selected-product-details/selected-product-details.html?itemId=${item.itemId}`;
        window.location.href = productDetailsUrl;
      });
      productsContainer.appendChild(productCard);
    });
  } else {
    productsContainer.innerHTML += "<p>No products available in this category.</p>";
  }
}
