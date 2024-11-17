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
  
            if (product) {
                // Check for empty fields and provide default values
                const description = product.description || "No description available";
                const brand = product.brand || "Unknown Brand";
                const material = product.material || "Not specified";
                const origin = product.origin || "Not specified";
                const warranty = product.warranty || "No warranty information";
                const weight = product.weight || "Not specified";
                const dimensions = product.dimensions || "Not specified";
                const availability = product.availability || "Check availability";
                const voltage = product.technical_specs?.voltage || "N/A";
                const maxTemp = product.technical_specs?.max_temp || "N/A";

                // Inject each product detail into its specific section
                document.getElementById("product-name").innerHTML = `<h2>${product.name}</h2>`;
                document.getElementById("product-image").innerHTML = `
                    <img class="main-image" src="${product.image}" alt="${product.name}" onerror="this.src='/assets/img/skyjet-placeholder.png'">
                `;
                document.getElementById("product-info").innerHTML = `
                    <p><strong>SKU:</strong> ${product.sku}</p>
                    <p><strong>Part Number:</strong> ${product.part_number}</p>
                    <p class="product-price" style="color: blue; font-weight: bold;">${product.price}</p>
                `;
                document.getElementById("product-details").innerHTML = `
                    <p class="product-rating">${product.rating} ⭐</p>
                    <p><strong>Availability:</strong> ${availability}</p>
                    <p><strong>Description:</strong> ${description}</p>
                    <p><strong>Brand:</strong> ${brand}</p>
                    <p><strong>Weight:</strong> ${weight}</p>
                    <p><strong>Dimensions:</strong> ${dimensions}</p>
                    <p><strong>Material:</strong> ${material}</p>
                    <p><strong>Origin:</strong> ${origin}</p>
                    <p><strong>Warranty:</strong> ${warranty}</p>
                `;
                document.getElementById("product-specs").innerHTML = `
                    <h3>Technical Specifications</h3>
                    <p><strong>Voltage:</strong> ${voltage}</p>
                    <p><strong>Max Temperature:</strong> ${maxTemp}</p>
                `;

                // Add event listeners for order buttons if they exist on the page
                const whatsappButton = document.getElementById("whatsapp-order");
                const callButton = document.getElementById("call-order");
                const emailButton = document.getElementById("email-order");

                if (whatsappButton) {
                    whatsappButton.addEventListener("click", () => {
                        const whatsappMessage = `Hello, I would like to order the following product:\n\nName: ${product.name}\nPrice: ${product.price}\nDescription: ${description}\nBrand: ${brand}\nRating: ${product.rating} ⭐\nAvailability: ${availability}`;
                        window.open(`https://wa.me/254113015069?text=${encodeURIComponent(whatsappMessage)}`, "_blank");
                    });
                }

                if (callButton) {
                    callButton.addEventListener("click", () => {
                        window.location.href = "tel:+254113015069";
                    });
                }

                if (emailButton) {
                    emailButton.addEventListener("click", () => {
                        const emailSubject = `Order for ${product.name}`;
                        const emailBody = `Hello,\n\nI would like to order the following product:\n\nName: ${product.name}\nPrice: ${product.price}\nDescription: ${description}\nBrand: ${brand}\nRating: ${product.rating} ⭐\nAvailability: ${availability}`;
                        window.location.href = `mailto:khilary4600@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
                    });
                }
            } else {
                document.getElementById("product-details-container").innerHTML = "<p>Product not found.</p>";
            }
        })
        .catch((error) => {
            document.getElementById("product-details-container").innerHTML = "<p>Error fetching product details. Please try again later.</p>";
            console.error("Error fetching product details:", error);
        });
});
