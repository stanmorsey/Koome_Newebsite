document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
  
    fetch('/assets/products/products.json')
      .then(response => response.json())
      .then(products => {
        const product = products.find(p => p.id == productId);
        const similarProducts = products.filter(p => p.id != productId);
  
        const productDetailsContainer = document.getElementById('product-details-container');
        productDetailsContainer.innerHTML = `
          <h2>${product.name}</h2>
          <img src="${product.image}" alt="${product.name}">
          <p>${product.description}</p>
          <p><strong>Price:</strong> $${product.price}</p>
          <p><strong>Brand:</strong> ${product.brand}</p>
          <p><strong>Category:</strong> ${product.category}</p>
          <p><strong>Part Number:</strong> ${product.part_number}</p>
          <p><strong>Rating:</strong> ${product.rating} ⭐</p>
        `;
  
        const similarProductsContainer = document.getElementById('similar-products-container');
        similarProductsContainer.innerHTML = '<h3>Similar Products</h3>';
        similarProducts.forEach(similarProduct => {
          const similarProductElement = document.createElement('div');
          similarProductElement.classList.add('product');
          similarProductElement.innerHTML = `
            <h4>${similarProduct.name}</h4>
            <img src="${similarProduct.image}" alt="${similarProduct.name}">
            <p>${similarProduct.description}</p>
            <a href="product-details.html?id=${similarProduct.id}" class="view-more">View More</a>
          `;
          similarProductsContainer.appendChild(similarProductElement);
        });
      })
      .catch(error => console.error('Error fetching product details:', error));
  });