document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("query") ? urlParams.get("query").toLowerCase() : "";

    fetch('/assets/products/products.json')
        .then(response => response.json())
        .then(data => {
            const items = data.menuTitles.flatMap(menu =>
                menu.categories.flatMap(category => category.items)
            );

            // Search Logic
            const results = advancedSearch(items, query);

            // Display the results
            displayResults(results, query);
        })
        .catch(error => console.error("Error fetching products:", error));
});

function advancedSearch(items, query) {
    if (!query) return [];

    // Weight-based filtering
    const exactMatches = [];
    const partialMatches = [];
    const fuzzyMatches = [];

    items.forEach(item => {
        const fields = [
            item.partNumber.toLowerCase(),
            item.name.toLowerCase(),
            item.description.toLowerCase(),
            ...(item.tags || []).map(tag => tag.toLowerCase())
        ];

        const exactMatch = fields.some(field => field === query);
        const partialMatch = fields.some(field => field.includes(query));
        const fuzzyMatch = fields.some(field => levenshteinDistance(field, query) <= 2); // Typo tolerance

        if (exactMatch) {
            exactMatches.push(item);
        } else if (partialMatch) {
            partialMatches.push(item);
        } else if (fuzzyMatch) {
            fuzzyMatches.push(item);
        }
    });

    // Combine results with priority
    return [...exactMatches, ...partialMatches, ...fuzzyMatches];
}

function displayResults(results, query) {
    const resultsContainer = document.getElementById("results-container");
    resultsContainer.innerHTML = "";

    if (results.length === 0) {
        resultsContainer.innerHTML = "<p class='error-message'>No products found. Try different keywords!</p>";
        return;
    }

    results.forEach(item => {
        const resultCard = document.createElement("div");
        resultCard.className = "result-card";

        // Create the card with placeholder image fallback and redirection link
        resultCard.innerHTML = `
            <a href="/search-results/searched-product-details.html?productId=${item.itemId || 'default'}" class="item-link">
                <div class="item-card mb-4">
                    <img 
                        src="${item.imageGallery[0] || '/assets/img/skyjet-placeholder.png'}" 
                        class="item-image" 
                        alt="${item.name}" 
                        onerror="this.onerror=null; this.src='/assets/img/skyjet-placeholder.png';"
                    >
                    <div class="item-details">
                        <h5 class="item-name">${highlightMatch(item.name, query)}</h5>
                        <!--<p class="item-description">${highlightMatch(item.description, query)}</p>-->
                        <p class="item-part-number">MPN: ${item.partNumber}</p>
                        <p class="item-price"> <strong>${item.currency}${item.price}</strong></p>
                    </div>
                </div>
            </a>
        `;
        resultsContainer.appendChild(resultCard);
    });
}

// Helper Function: Highlight Matches
function highlightMatch(text, query) {
    if (!text || !query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Helper Function: Levenshtein Distance
function levenshteinDistance(a, b) {
    const matrix = Array.from({ length: b.length + 1 }, () =>
        Array(a.length + 1).fill(0)
    );

    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= b.length; j++) {
        for (let i = 1; i <= a.length; i++) {
            if (b[j - 1] === a[i - 1]) {
                matrix[j][i] = matrix[j - 1][i - 1];
            } else {
                matrix[j][i] = Math.min(
                    matrix[j - 1][i] + 1, // Deletion
                    matrix[j][i - 1] + 1, // Insertion
                    matrix[j - 1][i - 1] + 1 // Substitution
                );
            }
        }
    }

    return matrix[b.length][a.length];
}
