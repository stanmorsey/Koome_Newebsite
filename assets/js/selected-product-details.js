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
  <div class="product-details">
    <div class="product-image-container">
      <img 
        src="${foundProduct.imageGallery?.[0]}" 
        alt="${foundProduct.name}" 
        class="product-image"
        onerror="this.src='/assets/img/skyjet-placeholder.png'"
      />
    </div>
    <div class="product-details-content">
      <h1 class="product-name">${foundProduct.name}</h1>
      <p class="product-price"><strong>Price:</strong> ${foundProduct.currency}${foundProduct.price}</p>
      <p class="product-part-number"><strong>Part Number:</strong> ${foundProduct.partNumber}</p>
      <p class="product-description"><strong>Description:</strong> ${foundProduct.description}</p>
      <p class="product-sku"><strong>SKU:</strong> ${foundProduct.sku}</p>
      <p class="product-weight"><strong>Weight:</strong> ${foundProduct.weight}</p>
      <p class="product-dimensions"><strong>Dimensions:</strong> ${foundProduct.dimensions}</p>
      <p class="product-brand"><strong>Brand:</strong> ${foundProduct.brand}</p>
      <p class="product-tags"><strong>Tags:</strong> ${foundProduct.tags.join(", ")}</p>
      <p class="product-availability"><strong>Availability:</strong> ${foundProduct.isAvailable ? "In Stock" : "Out of Stock"}</p>
      <div class="enquiry-buttons">
        <a href="https://wa.me/?text=I'm%20interested%20in%20${encodeURIComponent(foundProduct.name)}" 
           target="_blank" 
           class="btn btn-whatsapp"
           id="whatsapp-enquiry">Enquire via WhatsApp</a>
        <a href="tel:+1234567890" class="btn btn-call" id="call-enquiry">Call to Enquire</a>
      </div>
    </div>
  </div>
`;

}
