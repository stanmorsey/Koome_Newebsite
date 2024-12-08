// Select the container to display the product details
const productDetailsContainer = document.getElementById("product-details-container");
const relatedItemsContainer = document.getElementById("related-items-container");

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
      const menuData = data.menuTitles;
      displayProductDetails(menuData, itemId);
      fetchRelatedItems(menuData, itemId); // Fetch and display related items
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
  const encodedMessage = encodeURIComponent(`Hello Skyjet,

I am interested in the following product:

- Name: ${foundProduct.name}
- Price: ${price}
- Part Number: ${partNumber}
- Description: ${description}
- Image Link: ${imageLink}

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

// Function to fetch and display related items
function fetchRelatedItems(menuData, itemId) {
  const relatedItemsGrid = document.querySelector(".related-items-grid");

  if (!relatedItemsGrid) {
    console.error("Related items grid container not found.");
    return;
  }

  let foundCategory = null;

  // Find the category
  menuData.some(menu => {
    return menu.categories.some(category => {
      const item = category.items.find(it => it.itemId === itemId);
      if (item) {
        foundCategory = category;
        return true;
      }
      return false;
    });
  });

  if (!foundCategory) {
    relatedItemsGrid.innerHTML = "<p class='error-message'>No related items found.</p>";
    return;
  }

  // Filter related items
  const relatedItems = foundCategory.items.filter(item => item.itemId !== itemId);

  // Limit the number of items to display (e.g., first 6 items for 2 rows with 3 items per row)
  const itemsToShow = relatedItems.slice(0, 5);

  if (itemsToShow.length > 0) {
    relatedItemsGrid.innerHTML = ""; // Clear grid
    itemsToShow.forEach(item => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";
      productCard.innerHTML = `
        <div class="product-card-image">
          <img 
            src="${item.imageGallery?.[0] || '/assets/img/skyjet-placeholder.png'}" 
            alt="${item.name}" 
            onerror="this.src='/assets/img/skyjet-placeholder.png'"
          />
        </div>
        <div class="product-card-content">
          <h2 class="product-card-title">${item.name}</h2>
          <p class="product-card-price">${item.currency || ""} ${item.price}</p>
          <p class="product-card-part">MFR PART: ${item.partNumber || "N/A"}</p>
        </div>
      `;

      productCard.addEventListener("click", () => {
        const productDetailsUrl = `/selected-product-details/selected-product-details.html?itemId=${item.itemId}`;
        window.location.href = productDetailsUrl;
      });

      relatedItemsGrid.appendChild(productCard);
    });
  } else {
    relatedItemsGrid.innerHTML = "<p class='error-message'>No related items available.</p>";
  }
}
