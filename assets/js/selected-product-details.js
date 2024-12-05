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

  // Fallback values for optional properties
  const imageLink = foundProduct.imageGallery?.[0] || "/assets/img/skyjet-placeholder.png";
  const price = `${foundProduct.currency || ""}${foundProduct.price}`;
  const partNumber = foundProduct.partNumber || "Not available";
  const description = foundProduct.description || "No description available";

  // Construct the WhatsApp message
  const encodedMessage = encodeURIComponent(`
  Hello skyjet,

  I am interested in the following product:

    *Name:* ${foundProduct.name}
    *Price:* ${price}
    *Part Number:* ${partNumber}
    *Description:* ${description}
    *Image Link:* ${imageLink}

  Could you please confirm availability and provide additional details?

  Thank you.
  `);

  const whatsappUrl = `https://wa.me/+254796962055?text=${encodedMessage}`;

  // Display the product details
  productDetailsContainer.innerHTML = `
    <div class="product-detail">
      <!-- Image Section -->
      <img 
        src="${imageLink}" 
        alt="${foundProduct.name}" 
        class="product-detail-image"
        onerror="this.src='/assets/img/skyjet-placeholder.png'"
      />
      
      <!-- Information Section -->
      <div class="product-info">
        <h1 class="product-name">${foundProduct.name}</h1>
        <p class="product-price">${price}</p>
        <p class="product-short-description">${description}</p>
        
        <ul class="product-specifications">
          <li><strong>Manufacturer Part Number:</strong> ${partNumber}</li>
          <li><strong>Weight:</strong> ${foundProduct.weight || "Not specified"}</li>
          <li><strong>Dimensions:</strong> ${foundProduct.dimensions || "Not specified"}</li>
          <li><strong>Tags:</strong> ${Array.isArray(foundProduct.tags) ? foundProduct.tags.join(", ") : "No tags available"}</li>
          <li><strong>Availability:</strong> ${foundProduct.isAvailable ? "In Stock" : "Out of Stock"}</li>
        </ul>
        
        <!-- Action Buttons -->
        <div class="product-actions">
          <a href="${whatsappUrl}" 
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
