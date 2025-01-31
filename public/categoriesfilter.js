
// JavaScript for Accordion
const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach(item => {
  const header = item.querySelector('.accordion-header');
  const content = item.querySelector('.accordion-content');
  const arrow = item.querySelector('.arrow');

  header.addEventListener('click', () => {
    const isOpen = content.style.display === 'block';
    content.style.display = isOpen ? 'none' : 'block';
    arrow.classList.toggle('rotate', !isOpen);
  });
});



// Gömma storlek 
document.addEventListener('DOMContentLoaded', function() {
const categoryName = '<%= categoryName %>'; // Hämta kategori namn
if (categoryName === 'Elektronik') {
  const sizeFilter = document.getElementById('size-filter');
  if (sizeFilter) {
    sizeFilter.style.display = 'none'; // Döljer storleksfilter
  }
}
});




document.addEventListener("DOMContentLoaded", function () {
    const sortCheckboxes = document.querySelectorAll(".accordion-item:first-child .accordion-content input[type='checkbox']");
    const filterCheckboxes = document.querySelectorAll(".accordion-item:not(:first-child) .accordion-content input[type='checkbox']");
    const colorInput = document.getElementById("color-input"); // Hämta textinput för färg
    const filterButton = document.getElementById("apply-filters");

    let selectedSortOption = null;
    let selectedFilters = [];
    let selectedColor = ""; // Spara färgen från input-fältet

    // Hantera sorteringsval (endast en kan väljas)
    sortCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", (e) => {
            // Avmarkera andra sorteringsalternativ
            sortCheckboxes.forEach(cb => {
                if (cb !== e.target) cb.checked = false;
            });

            selectedSortOption = e.target.checked ? e.target.parentElement.textContent.trim() : null;
            console.log("Selected sort option:", selectedSortOption);

            // Aktivera knappen om något filter är valt
            filterButton.disabled = !hasActiveFilters();
        });
    });

    // Hantera filteralternativ (flera kan väljas)
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            updateSelectedFilters();
        });
    });

    // Hantera färginput (uppdatera värdet när användaren skriver)
    colorInput.addEventListener("input", () => {
        selectedColor = colorInput.value.trim().toLowerCase(); // Normalisera till gemener
        console.log("Selected color:", selectedColor);
        filterButton.disabled = !hasActiveFilters();
    });

    // När knappen klickas, applicera filter och sortering
    filterButton.addEventListener("click", () => {
        updateSelectedFilters(); // Uppdatera filtren innan vi filtrerar produkter

        if (selectedFilters.length > 0 || selectedColor) {
            filterProducts(selectedFilters, selectedColor);
        } else {
            showAllProducts(); // Om inga filter är valda, visa alla produkter
        }

        if (selectedSortOption) {
            sortProducts(selectedSortOption);
        }
    });

    function updateSelectedFilters() {
        selectedFilters = Array.from(filterCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.parentElement.textContent.trim());

        filterButton.disabled = !hasActiveFilters();
        console.log("Selected filters:", selectedFilters);
    }

    function hasActiveFilters() {
        return selectedFilters.length > 0 || selectedColor.length > 0 || selectedSortOption;
    }

    function filterProducts(filters, color) {
        const products = document.querySelectorAll(".product-card");

        let anyMatch = false; // Om ingen produkt matchar, visas alla produkter

        products.forEach(product => {
            const brand = product.querySelector(".product-brand-price span:first-child")?.textContent.trim().toLowerCase() || "";
            const size = product.querySelector(".product-size")?.textContent.trim().toLowerCase() || "";
            const productColor = product.dataset.color?.toLowerCase() || "";
            const condition = product.dataset.condition?.toLowerCase() || "";

            let matches = filters.length === 0; // Om inga filter finns, sätt match till true

            if (filters.length > 0) {
                matches = filters.some(filter =>
                    brand === filter.toLowerCase() ||
                    size === filter.toLowerCase() ||
                    condition === filter.toLowerCase()
                );
            }

            // Om en färg är inskriven, matcha den med produktens färg
            if (color.length > 0) {
                matches = matches && productColor.includes(color);
            }

            product.style.display = matches ? "block" : "none";
            if (matches) anyMatch = true;
        });

        // Om **inga filter är valda** och ingen produkt matchade, visa alla produkter
        if (!anyMatch && (filters.length === 0 && color.length === 0)) {
            showAllProducts();
        }
    }

    function showAllProducts() {
        console.log("Inga filter valda - visar alla produkter!");
        document.querySelectorAll(".product-card").forEach(product => {
            product.style.display = "block"; // Visa alla produkter
        });
    }

    function sortProducts(sortOption) {
        const productContainer = document.querySelector(".product-container");
        const products = Array.from(document.querySelectorAll(".product-card:not([style*='display: none'])"));

        products.sort((a, b) => {
            switch (sortOption) {
                case "Lägsta pris":
                    return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
                case "Högsta pris":
                    return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
                default:
                    return 0;
            }
        });

        // Rensa och lägg tillbaka sorterade produkter
        productContainer.innerHTML = "";
        products.forEach(product => productContainer.appendChild(product));
    }
});






