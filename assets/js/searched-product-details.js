document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("productId");

  if (!productId) {
      displayError("Product ID not provided in the URL.");
      return;
  }

  fetch('/assets/products/products.json')
      .then(response => response.json())
      .then(data => {
          const items = data.menuTitles.flatMap(menu =>
              menu.categories.flatMap(category => category.items)
          );

          const foundProduct = items.find(item => item.itemId === productId);

          if (foundProduct) {
              displayProductDetails(foundProduct);
              fetchRelatedItems(data.menuTitles, productId); // Fetch related items
          } else {
              displayError("Product not found.");
          }
      })
      .catch(error => {
          console.error("Error fetching product details:", error);
          displayError("An error occurred while fetching product details.");
      });
});

function displayProductDetails(foundProduct) {
  const productDetailsContainer = document.getElementById("product-details-container");
  const imageLink = foundProduct.imageGallery[0] || '/assets/img/skyjet-placeholder.png';
  const price = `${foundProduct.currency}${foundProduct.price || "Price <strong>NOT</strong> Specified"}`;
  const description = foundProduct.description || "No description available.";
  const partNumber = foundProduct.partNumber || "Call to confirm MFR part number";

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

  productDetailsContainer.innerHTML = `
      <div class="product-detail">
          <img 
              src="${imageLink}" 
              alt="${foundProduct.name}" 
              class="product-detail-image"
              onerror="this.src='/assets/img/skyjet-placeholder.png'"
          />
          <div class="product-info">
              <h1 class="product-name">${foundProduct.name}</h1>
              <p class="product-price">${price}</p>
              <p class="product-short-description">${description}</p>
              <ul class="product-specifications">
                  <li><strong>MFR PART NUMBER:</strong> ${partNumber}</li>
                  <li><strong>Weight:</strong> ${foundProduct.weight || "Not specified"}</li>
                  <li><strong>Dimensions:</strong> ${foundProduct.dimensions || "Not specified"}</li>
                  <li><strong><!--Tags:--></strong> ${Array.isArray(foundProduct.tags) ? foundProduct.tags.join(", ") : "No tags available"}</li>
                  <li><strong><!--Availability:--></strong> ${foundProduct.isAvailable ? "In Stock" : "Out of Stock"}</li>
              </ul>
              <div class="product-actions">
                  <a href="${whatsappUrl}" target="_blank" class="btn order-whatsapp">
                      <img src="/assets/img/logoFaviconIcon/whatsapp.png" alt="WhatsApp" class="whatsapp-icon" />
                      Enquire via WhatsApp
                  </a>
                  <a href="tel:+254796962055" class="btn">Enquire on Call</a>
              </div>
          </div>
      </div>
  `;
}

function fetchRelatedItems(menuData, itemId) {
  const relatedItemsGrid = document.querySelector(".related-items-grid");

  if (!relatedItemsGrid) {
      console.error("Related items grid container not found.");
      return;
  }

  let foundCategory = null;

  // Find the category containing the current item
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

  // Limit the number of items to display (e.g., first 6 items)
  const itemsToShow = relatedItems.slice(0, 6);

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

function displayError(message) {
  const productDetailsContainer = document.getElementById("product-details-container");
  productDetailsContainer.innerHTML = `<p class="error-message">${message}</p>`;
}
