// Sample product data with 10 products per category
const products = [
    {
        name: "Jet Engine Oil",
        category: "Lubricants",
        price: "KES 5000",
        image: "https://via.placeholder.com/250x180",
        partNumber: "12345"
    },
    {
        name: "Synthetic Lubricant",
        category: "Lubricants",
        price: "KES 7000",
        image: "https://via.placeholder.com/250x180",
        partNumber: "56789"
    },
    // Add 8 more lubricant products
    {
        name: "Hydraulic Jet Fluid",
        category: "Hydraulic Fluids",
        price: "KES 12000",
        image: "https://via.placeholder.com/250x180",
        partNumber: "54321"
    },
    {
        name: "Advanced Hydraulic Fluid",
        category: "Hydraulic Fluids",
        price: "KES 15000",
        image: "https://via.placeholder.com/250x180",
        partNumber: "98765"
    },
    // Add 8 more hydraulic fluids
    {
        name: "Jet Engine Spark Plug",
        category: "Engine Parts",
        price: "KES 8000",
        image: "https://via.placeholder.com/250x180",
        partNumber: "67890"
    },
    {
        name: "Advanced Engine Spark Plug",
        category: "Engine Parts",
        price: "KES 9500",
        image: "https://via.placeholder.com/250x180",
        partNumber: "87654"
    },
    // Add 8 more engine parts
    {
        name: "Aircraft Electrical Wire",
        category: "Electrical Systems",
        price: "KES 2000",
        image: "https://via.placeholder.com/250x180",
        partNumber: "98765"
    },
    {
        name: "Advanced Electrical Wire",
        category: "Electrical Systems",
        price: "KES 3000",
        image: "https://via.placeholder.com/250x180",
        partNumber: "76543"
    }
    // Add 8 more electrical systems
];

// Function to display products
function displayProducts(filteredProducts) {
    const productContainer = document.getElementById("product-list");
    productContainer.innerHTML = ""; // Clear previous results

    filteredProducts.forEach(product => {
        const productCard = `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">${product.price}</div>
                <p>Part Number: ${product.partNumber}</p>
                <div class="product-actions">
                    <button>More Details</button>
                    <button class="whatsapp-btn">Order on WhatsApp</button>
                </div>
            </div>
        `;
        productContainer.innerHTML += productCard;
    });
}

// Display all products on page load
displayProducts(products);

// Search product by name
function searchProduct() {
    const query = document.getElementById("search-bar").value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query)
    );
    displayProducts(filteredProducts);
}

// Filter product by category
function filterCategory(category) {
    const filteredProducts = products.filter(product => product.category === category);
    displayProducts(filteredProducts);
}
