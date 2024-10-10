document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productSku = urlParams.get('sku');  // Get the 'sku' parameter from the URL
  
    fetch('/assets/products/products.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        return response.json();
      })
      .then(products => {
        const product = products.find(p => p.sku == productSku);
        const similarProducts = products.filter(p => p.sku != productSku);
  
        const productDetailsContainer = document.getElementById('product-details-container');
        const similarProductsContainer = document.getElementById('similar-products-container');
  
        if (product) {
          // Check for empty fields and provide default values or skip displaying them if needed
          const description = product.description ? product.description : 'No description available';
          const brand = product.brand ? product.brand : 'Unknown Brand';
          const material = product.material ? product.material : 'Not specified';
          const origin = product.origin ? product.origin : 'Not specified';
          const warranty = product.warranty ? product.warranty : 'No warranty information';
          const weight = product.weight ? product.weight : 'Not specified';
          const dimensions = product.dimensions ? product.dimensions : 'Not specified';
          const availability = product.availability ? product.availability : 'Check availability';
  
          // Extract technical specs if available
          const voltage = product.technical_specs.voltage ? product.technical_specs.voltage : 'N/A';
          const maxTemp = product.technical_specs.max_temp ? product.technical_specs.max_temp : 'N/A';
  
          productDetailsContainer.innerHTML = `
            <h2>${product.name}</h2>
            <img src="${product.image}" alt="${product.name}">
            <p>${description}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>Brand:</strong> ${brand}</p>
            <p><strong>Category:</strong> ${product.category}</p>
            <p><strong>Part Number:</strong> ${product.part_number}</p>
            <p><strong>Rating:</strong> ${product.rating} ⭐</p>
            <p><strong>Availability:</strong> ${availability}</p>
            <p><strong>Weight:</strong> ${weight}</p>
            <p><strong>Dimensions:</strong> ${dimensions}</p>
            <p><strong>Material:</strong> ${material}</p>
            <p><strong>Origin:</strong> ${origin}</p>
            <p><strong>Warranty:</strong> ${warranty}</p>
            <h3>Technical Specifications</h3>
            <p><strong>Voltage:</strong> ${voltage}</p>
            <p><strong>Max Temperature:</strong> ${maxTemp}</p>
            <button id="whatsapp-order">Order via WhatsApp</button>
            <button id="call-order">Order via Call</button>
            <button id="email-order">Order via Email</button>
          `;
  
          // Add event listeners for order buttons
          document.getElementById('whatsapp-order').addEventListener('click', () => {
            const whatsappMessage = `Hello, I would like to order the following product:\n\nName: ${product.name}\nPrice: ${product.price}\nDescription: ${description}\nBrand: ${brand}\nCategory: ${product.category}\nPart Number: ${product.part_number}\nRating: ${product.rating} ⭐\nAvailability: ${availability}\nWeight: ${weight}\nDimensions: ${dimensions}\nMaterial: ${material}\nOrigin: ${origin}\nWarranty: ${warranty}\nVoltage: ${voltage}\nMax Temperature: ${maxTemp}`;
            window.open(`https://wa.me/yourphonenumber?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
          });
  
          document.getElementById('call-order').addEventListener('click', () => {
            window.location.href = 'tel:yourphonenumber';
          });
  
          document.getElementById('email-order').addEventListener('click', () => {
            const emailSubject = `Order for ${product.name}`;
            const emailBody = `Hello,\n\nI would like to order the following product:\n\nName: ${product.name}\nPrice: ${product.price}\nDescription: ${description}\nBrand: ${brand}\nCategory: ${product.category}\nPart Number: ${product.part_number}\nRating: ${product.rating} ⭐\nAvailability: ${availability}\nWeight: ${weight}\nDimensions: ${dimensions}\nMaterial: ${material}\nOrigin: ${origin}\nWarranty: ${warranty}\nVoltage: ${voltage}\nMax Temperature: ${maxTemp}`;
            window.location.href = `mailto:youremail@example.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
          });
        } else {
          productDetailsContainer.innerHTML = '<p>Product not found.</p>';
        }
  
        if (similarProducts.length) {
          similarProductsContainer.innerHTML = '<h3>Similar Products</h3>';
          similarProducts.forEach(similarProduct => {
            const similarProductElement = document.createElement('div');
            similarProductElement.classList.add('product');
            similarProductElement.innerHTML = `
              <h4>${similarProduct.name}</h4>
              <img src="${similarProduct.image}" alt="${similarProduct.name}">
              <p>${similarProduct.description ? similarProduct.description : 'No description available'}</p>
              <a href="product-details.html?sku=${similarProduct.sku}" class="view-more">View More</a>
            `;
            similarProductsContainer.appendChild(similarProductElement);
          });
        } else {
          similarProductsContainer.innerHTML = '<p>No similar products available.</p>';
        }
      })
      .catch(error => {
        const productDetailsContainer = document.getElementById('product-details-container');
        productDetailsContainer.innerHTML = '<p>Error fetching product details. Please try again later.</p>';
        console.error('Error fetching product details:', error);
      });
  });
  