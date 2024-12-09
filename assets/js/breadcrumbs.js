document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("productId");

    if (productId) {
        initBreadcrumbs(productId);
    } else {
        console.error("Product ID not provided.");
    }
});

function initBreadcrumbs(productId, jsonUrl = '/assets/products/products.json') {
    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            const breadcrumbPath = findBreadcrumbPath(data.menuTitles, productId);
            if (breadcrumbPath) {
                injectBreadcrumbs(breadcrumbPath);
            } else {
                console.error("Breadcrumb path not found for the product.");
            }
        })
        .catch(error => {
            console.error("Error fetching products:", error);
        });
}

function findBreadcrumbPath(menuTitles, productId) {
    let breadcrumbPath = null;

    menuTitles.some(menu => {
        return menu.categories.some(category => {
            const item = category.items.find(it => it.itemId === productId);
            if (item) {
                breadcrumbPath = {
                    menuTitle: menu.title,
                    categoryTitle: category.title,
                    productName: item.name
                };
                return true;
            }
            return false;
        });
    });

    return breadcrumbPath;
}

function injectBreadcrumbs(path) {
    const breadcrumbContainer = document.querySelector(".breadcrumbs");

    if (!breadcrumbContainer) {
        console.error("Breadcrumb container not found in the HTML.");
        return;
    }

    breadcrumbContainer.innerHTML = `
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="/index.html">Home</a></li>
                <li class="breadcrumb-item"><a href="/menu/${path.menuTitle.toLowerCase()}.html">${path.menuTitle}</a></li>
                <li class="breadcrumb-item"><a href="/category/${path.categoryTitle.toLowerCase()}.html">${path.categoryTitle}</a></li>
                <li class="breadcrumb-item active" aria-current="page">${path.productName}</li>
            </ol>
        </nav>
    `;
}
