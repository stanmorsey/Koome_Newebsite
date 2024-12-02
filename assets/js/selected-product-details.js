// Select the container to display the product details
const productDetailsContainer = document.getElementById("product-details-container");

// Get the product ID from the URL
const params = new URLSearchParams(window.location.search);
const itemId = params.get("itemId");

if (!itemId) {
    productDetailsContainer.innerHTML = "<p class='error-message'>Product not specified. Please return to the products page.</p>";
} else {
    // Fetch JSON data from external file
    fetch("/assets/products/products.json")
        .then(response => {
            if (!response.ok) throw new Error("Failed to load JSON data.");
            return response.json();
        })
        .then(data => {
            displayProductDetails(data.menuTitles, itemId);
        })
        .catch(error => {
            console.error("Error fetching JSON data:", error);
            productDetailsContainer.innerHTML = "<p class='error-message'>Error loading product details. Please try again later.</p>";
        });
}

// Function to display product details for a specific item
function displayProductDetails(menuData, itemId) {
    let foundProduct = null;

    // Find the product in the JSON data
    menuData.some(menu => {
        return menu.categories.some(category => {
            const item = category.items.find(it => it.itemId === itemId);
            if (item) {
                foundProduct = item;
                return true;
            }
            return false;
        });
    });

    if (!foundProduct) {
        productDetailsContainer.innerHTML = "<p class='error-message'>Product not found. Please return to the products page.</p>";
        return;
    }

    // Display the product details
productDetailsContainer.innerHTML = `
  <div class="product-detail">
    <!-- Image Section -->
    <img 
      src="${foundProduct.imageGallery?.[0]}" 
      alt="${foundProduct.name}" 
      class="product-detail-image"
      onerror="this.src='/assets/img/skyjet-placeholder.png'"
    />
    
    <!-- Information Section -->
    <div class="product-info">
      <h1 class="product-name">${foundProduct.name}</h1>
      <p class="product-price">${foundProduct.currency}${foundProduct.price}</p>
      <p class="product-short-description"> ${foundProduct.description}</p>
      
      <ul class="product-specifications">
        <li><strong>Manufacturer Part Number:</strong> ${foundProduct.partNumber}</li>
        <li><strong>Weight:</strong> ${foundProduct.weight}</li>
        <li><strong>Dimensions:</strong> ${foundProduct.dimensions}</li>
        <li><strong>Tags:</strong> ${foundProduct.tags.join(", ")}</li>
        <li><strong>Availability:</strong> ${foundProduct.isAvailable ? "In Stock" : "Out of Stock"}</li>
      </ul>
      
      <!-- Action Buttons -->
      <div class="product-actions">
        <a href="https://wa.me/+254796962055?text=I'm%20interested%20in%20${encodeURIComponent(foundProduct.name)}" 
           target="_blank" 
           class="btn order-whatsapp">
          <img src="/assets/img/logoFaviconIcon/whatsapp.png" alt="WhatsApp" class="whatsapp-icon" />
          Enquire via WhatsApp
        </a>
        <a href="tel:+254796962055" class="btn">Call to Enquire</a>
      </div>
    </div>
  </div>
`;


}
