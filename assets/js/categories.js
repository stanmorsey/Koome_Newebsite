// Select the categories container
const categoriesContainer = document.getElementById("categories-container");

// Get the page identifier from the URL
const params = new URLSearchParams(window.location.search);
const pageTitle = params.get("page"); // E.g., "Aircraft Engine Parts" or "Avionics & Instruments"

// Fetch JSON data from external file
fetch("/assets/products/products.json")
  .then(response => {
    if (!response.ok) throw new Error("Failed to load JSON data.");
    return response.json();
  })
  .then(data => {
    displayCategories(data.menuTitles, pageTitle);
  })
  .catch(error => {
    console.error("Error fetching JSON data:", error);
    categoriesContainer.innerHTML = "<p>Error loading categories. Please try again later.</p>";
  });

// Function to display categories
function displayCategories(menuData, pageTitle) {
  const selectedMenu = menuData.find(menu => menu.menuTitle === pageTitle);
  if (!selectedMenu) {
    categoriesContainer.innerHTML = "<p>Categories not found for this page.</p>";
    return;
  }

  selectedMenu.categories.forEach(category => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${category.image}" alt="${category.name}" />
      <h2>${category.name}</h2>
    `;
    card.addEventListener("click", () => displayProducts(category));
    categoriesContainer.appendChild(card);
  });
}

// Function to display products in a category
function displayProducts(category) {
  // Clear the container for new content
  categoriesContainer.innerHTML = `<h1>${category.name}</h1>`;
  
  if (category.items && category.items.length > 0) {
    category.items.forEach(item => {
      const productCard = document.createElement("div");
      productCard.className = "card";
      productCard.innerHTML = `
        <img src="${item.imageGallery[0]}" alt="${item.name}" />
        <h2>${item.name}</h2>
        <p>Part Number: ${item.partNumber}</p>
      `;
      categoriesContainer.appendChild(productCard);
    });
  } else {
    categoriesContainer.innerHTML += "<p>No products available in this category.</p>";
  }
}
