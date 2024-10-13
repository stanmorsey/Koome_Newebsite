document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
  
    // Function to perform the search
    const performSearch = () => {
      const query = searchInput.value.toLowerCase();
      fetch("/assets/products/products.json")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch products");
          }
          return response.json();
        })
        .then((products) => {
          const results = products.filter((product) => {
            return (
              product.name.toLowerCase().includes(query) ||
              product.part_number.toLowerCase().includes(query) ||
              product.keywords.some((keyword) => keyword.toLowerCase().includes(query))
            );
          });
  
          displayResults(results);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    };
  
    // Event listener for the search button
    searchButton.addEventListener("click", performSearch);
  
    // Event listener for the Enter key
    searchInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        performSearch();
      }
    });
  
    function displayResults(results) {
      const resultsContainer = document.getElementById("product-container");
      const filters = {
        category: [],
        brand: [],
        series: [],
        material: [],
        size: [],
        spec: [],
        color: [],
        price: []
      };
  
      resultsContainer.innerHTML = ''; // Clear previous results
  
      results.forEach((product) => {
        const productElement = document.createElement("div");
        productElement.classList.add("product-item");
        productElement.innerHTML = `
          <img src="${product.image}" alt="${product.name}" onerror="this.src='/assets/img/skyjet-placeholder.png'">
          <h3>${product.name}</h3>
          <p>${product.part_number}</p>
          <p>${product.price}</p>
        `;
        resultsContainer.appendChild(productElement);
  
        // Populate filters
        if (!filters.category.includes(product.category)) filters.category.push(product.category);
        if (!filters.brand.includes(product.brand)) filters.brand.push(product.brand);
        if (!filters.series.includes(product.series)) filters.series.push(product.series);
        if (!filters.material.includes(product.material)) filters.material.push(product.material);
        if (!filters.size.includes(product.size)) filters.size.push(product.size);
        if (!filters.spec.includes(product.spec)) filters.spec.push(product.spec);
        if (!filters.color.includes(product.color)) filters.color.push(product.color);
        if (!filters.price.includes(product.price)) filters.price.push(product.price);
      });
  
      // Populate filter sections
      Object.keys(filters).forEach((filter) => {
        const filterContent = document.getElementById(filter);
        filterContent.innerHTML = ''; // Clear previous filters
        filters[filter].forEach((item) => {
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.value = item;
          checkbox.id = `${filter}-${item}`;
          const label = document.createElement("label");
          label.htmlFor = `${filter}-${item}`;
          label.textContent = item;
          filterContent.appendChild(checkbox);
          filterContent.appendChild(label);
        });
      });
    }
  });
  