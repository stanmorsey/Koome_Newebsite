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
            const product = products.find((p) => p.sku === productSku);

            const productDetailsContainer = document.getElementById("product-details-container");

            if (product) {
                // Provide default values for missing fields
                const name = product.name || "Unnamed Product";
                const price = product.currency ? `${product.currency} ${product.price}` : "Price not available";
                const image = product.image || "/assets/img/skyjet-placeholder.png";
                const description = product.description || "No description available";
                const brand = product.brand || "Unknown Brand";
                const category = product.category || "Uncategorized";
                const partNumber = product.part_number || "N/A";
                const alternate = product.alternate || "No alternates available";
                const manufacturer = product.manufacturer || "Unknown Manufacturer";
                const availability = product.availability || "Check availability";

                // Dynamically inject the product details HTML into the page
                productDetailsContainer.innerHTML = `
            <div class="product-main">
                <h2>${name}</h2>
                <hr>
                <div class="product-details">
                    <div class="product-images">
                        <img class="main-image" src="${image}" alt="${name}" onerror="this.src='/assets/img/skyjet-placeholder.png'">
                    </div>
                    <div class="product-info">
                        <p><strong>SKU:</strong> ${product.sku}</p>
                        <p><strong>Part Number:</strong> ${partNumber}</p>
                        <p><strong>Category:</strong> ${category}</p>
                        <p><strong>Alternate Numbers:</strong> ${alternate}</p>
                        <p><strong>Manufacturer:</strong> ${manufacturer}</p>
                        <p class="product-price" style="color: blue; font-weight: bold;">${price}</p>
                        <p><strong>Availability:</strong> ${availability}</p>
                        <p><strong>Description:</strong> ${description}</p>
                        <p><strong>Brand:</strong> ${brand}</p>
                        
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
                    const whatsappMessage = `Hello, I would like to order the following product:\n\nName: ${name}\nPrice: ${price}\nDescription: ${description}\nBrand: ${brand}\nCategory: ${category}\nAvailability: ${availability}`;
                    window.open(`https://wa.me/254796962055?text=${encodeURIComponent(whatsappMessage)}`, "_blank");
                });

                document.getElementById("call-order").addEventListener("click", () => {
                    window.location.href = "tel:+254796962055";
                });

                document.getElementById("email-order").addEventListener("click", () => {
                    const emailSubject = `Order for ${name}`;
                    const emailBody = `Hello,\n\nI would like to order the following product:\n\nName: ${name}\nPrice: ${price}\nDescription: ${description}\nBrand: ${brand}\nCategory: ${category}\nAvailability: ${availability}`;
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
