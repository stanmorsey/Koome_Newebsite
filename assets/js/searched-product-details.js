document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("productId");

    const productDetailsContainer = document.getElementById("details-container");

    if (!productId) {
        productDetailsContainer.innerHTML = 
            "<p class='error-message'>Product ID not found. Please try again.</p>";
        return;
    }

    fetch('/assets/products/products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load JSON file: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const foundProduct = findProductById(data.menuTitles, productId);

            if (!foundProduct) {
                productDetailsContainer.innerHTML = 
                    "<p class='error-message'>Product not found. It may no longer exist.</p>";
                return;
            }

            // Inject product details into the page
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
        })
        .catch(error => {
            console.error("Error fetching product details:", error);
            productDetailsContainer.innerHTML = 
                "<p class='error-message'>Unable to load product details. Please try again later.</p>";
        });

    function findProductById(menuTitles, productId) {
        for (const menu of menuTitles) {
            for (const category of menu.categories) {
                const product = category.items.find(item => item.itemId === productId);
                if (product) return product;
            }
        }
        return null;
    }
});
