document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productSku = urlParams.get("sku"); // Get the 'sku' parameter from the URL
  
    fetch("/assets/products/products.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }
            return response.json();
        })
        .then((products) => {
            const product = products.find((p) => p.sku == productSku);
  
            const productDetailsContainer = document.getElementById("product-details-container");
  
            if (product) {
                // Check for empty fields and provide default values or skip displaying them if needed
                const description = product.description ? product.description : "No description available";
                const brand = product.brand ? product.brand : "Unknown Brand";
                const material = product.material ? product.material : "Not specified";
                const origin = product.origin ? product.origin : "Not specified";
                const warranty = product.warranty ? product.warranty : "No warranty information";
                const weight = product.weight ? product.weight : "Not specified";
                const dimensions = product.dimensions ? product.dimensions : "Not specified";
                const availability = product.availability ? product.availability : "Check availability";
  
                // Extract technical specs if available
                const voltage = product.technical_specs.voltage ? product.technical_specs.voltage : "N/A";
                const maxTemp = product.technical_specs.max_temp ? product.technical_specs.max_temp : "N/A";
  
                // Dynamically inject the product details HTML into the page
                productDetailsContainer.innerHTML = `
                  <div class="product-main">
                      <h2>${product.name}</h2>
                      <hr>
                      <div class="product-details">
                          <div class="product-images">
                              <img class="main-image" src="${product.image}" alt="${product.name}" onerror="this.src='/assets/img/skyjet-placeholder.png'">
                          </div>
                          <div class="product-info">
                              <p><strong>SKU:</strong> ${product.sku}</p>
                              <p><strong>Part Number:</strong> ${product.part_number}</p>
                              <p class="product-price" style="color: blue; font-weight: bold;">${product.price}</p>
                              <p class="product-rating">${product.rating} ⭐</p>
                              <p><strong>Availability:</strong> ${availability}</p>
                              <p><strong>Description:</strong> ${description}</p>
                              <p><strong>Brand:</strong> ${brand}</p>
                              <p><strong>Weight:</strong> ${weight}</p>
                              <p><strong>Dimensions:</strong> ${dimensions}</p>
                              <p><strong>Material:</strong> ${material}</p>
                              <p><strong>Origin:</strong> ${origin}</p>
                              <p><strong>Warranty:</strong> ${warranty}</p>
                              
                              <h3>Technical Specifications</h3>
                              <p><strong>Voltage:</strong> ${voltage}</p>
                              <p><strong>Max Temperature:</strong> ${maxTemp}</p>
  
                              <div class="product-actions">
                                  <button id="whatsapp-order">Order via WhatsApp</button>
                                  <button id="call-order">Order via Call</button>
                                  <button id="email-order">Order via Email</button>
                              </div>
                          </div>
                      </div>
                  </div>
                `;
  
                // Add event listeners for order buttons
                document.getElementById("whatsapp-order").addEventListener("click", () => {
                    const whatsappMessage = `Hello, I would like to order the following product:\n\nName: ${product.name}\nPrice: ${product.price}\nDescription: ${description}\nBrand: ${brand}\nRating: ${product.rating} ⭐\nAvailability: ${availability}`;
                    window.open(`https://wa.me/254113015069?text=${encodeURIComponent(whatsappMessage)}`, "_blank");
                });
  
                document.getElementById("call-order").addEventListener("click", () => {
                    window.location.href = "tel:+254113015069";
                });
  
                document.getElementById("email-order").addEventListener("click", () => {
                    const emailSubject = `Order for ${product.name}`;
                    const emailBody = `Hello,\n\nI would like to order the following product:\n\nName: ${product.name}\nPrice: ${product.price}\nDescription: ${description}\nBrand: ${brand}\nRating: ${product.rating} ⭐\nAvailability: ${availability}`;
                    window.location.href = `mailto:khilary4600@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
                });
            } else {
                productDetailsContainer.innerHTML = "<p>Product not found.</p>";
            }
        })
        .catch((error) => {
            const productDetailsContainer = document.getElementById("product-details-container");
            productDetailsContainer.innerHTML = "<p>Error fetching product details. Please try again later.</p>";
            console.error("Error fetching product details:", error);
        });
  });
  