document.addEventListener("DOMContentLoaded", function () {
  // Get the search query from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("query") ? urlParams.get("query").toLowerCase() : "";

  // Get references to spinner and results container
  const spinner = document.getElementById("spinner");
  const resultsContainer = document.getElementById("results-container");

  // Show spinner while loading
  spinner.style.display = "flex";

  // Fetch JSON data and process the search
  fetch('/assets/products/products.json')
    .then(response => response.json())
    .then(data => {
      // Flatten the product items for easier searching
      const items = data.menuTitles.flatMap(menu =>
        menu.categories.flatMap(category => category.items)
      );

      // Perform search
      const results = advancedSearch(items, query);

      // Hide spinner after processing
      spinner.style.display = "none";

      // Display the results
      displayResults(results, query);
    })
    .catch(error => {
      // Hide spinner and show error message
      spinner.style.display = "none";
      resultsContainer.innerHTML = "<p>Error fetching products. Please try again later.</p>";
      console.error("Error fetching products:", error);
    });
});

// Advanced Search Logic
function advancedSearch(items, query) {
  if (!query) return [];

  // Filter items based on the query
  return items.filter(item =>
    item.partNumber.toLowerCase().includes(query) || // Match part number
    item.name.toLowerCase().includes(query) || // Match name
    item.description.toLowerCase().includes(query) || // Match description
    (item.tags || []).some(tag => tag.toLowerCase().includes(query)) // Match tags
  );
}

// Display Results Logic
function displayResults(results, query) {
  const resultsContainer = document.getElementById("results-container");
  resultsContainer.innerHTML = ""; // Clear previous results

  if (results.length === 0) {
    resultsContainer.innerHTML = "<p>No products found. Try different keywords!</p>";
    return;
  }

  // Create result cards for each item
  results.forEach(item => {
    const resultCard = document.createElement("div");
    resultCard.className = "col-md-4 mb-4";

    resultCard.innerHTML = `
        <div class="card h-100">
            <img src="${item.imageGallery[0]}" class="card-img-top" alt="${item.name}">
            <div class="card-body">
                <h5 class="card-title">${highlightMatch(item.name, query)}</h5>
                <p class="card-text"><strong>Part Number:</strong> ${item.partNumber}</p>
                <p class="card-text"><strong></strong> ${item.currency}${item.price}</p>
            </div>
        </div>
    `;
    resultsContainer.appendChild(resultCard);
  });
}

// Helper Function: Highlight Matching Terms
function highlightMatch(text, query) {
  if (!text || !query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}