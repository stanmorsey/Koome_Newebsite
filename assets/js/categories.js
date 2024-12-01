// Select the categories container
const categoriesContainer = document.getElementById("categories-container");

// Hardcoded Menu Title for the first menu (Aircraft Engine Parts)
const menuTitle = "Aircraft Engine Parts"; // Replace with the desired menu title

// Fetch JSON data from external file
fetch("/assets/products/products.json")
  .then(response => {
    if (!response.ok) throw new Error("Failed to load JSON data.");
    return response.json();
  })
  .then(data => {
    displayCategories(data.menuTitles, menuTitle);
  })
  .catch(error => {
    console.error("Error fetching JSON data:", error);
    categoriesContainer.innerHTML = "<p>Error loading categories. Please try again later.</p>";
  });

// Function to display categories for the specified menu title
function displayCategories(menuData, menuTitle) {
  const selectedMenu = menuData.find(menu => menu.menuTitle === menuTitle);
  if (!selectedMenu) {
    categoriesContainer.innerHTML = "<p>Categories not found for this menu.</p>";
    return;
  }

  selectedMenu.categories.forEach(category => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${category.image}" alt="${category.name}" />
      <h2>${category.name}</h2>
    `;

    // Redirect to the selected category's page on click
    card.addEventListener("click", () => {
      const categorySlug = encodeURIComponent(category.slug); // Encode slug for URL safety
      window.location.href = `/products-selected-category.html?category=${categorySlug}`;
    });

    categoriesContainer.appendChild(card);
  });
}
