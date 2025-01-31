
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
    const colorInput = document.getElementById("color-input");
    const filterButton = document.getElementById("apply-filters");
    const resetButton = document.getElementById("reset-filters");

    let selectedSortOption = null;
    let selectedFilters = [];
    let selectedColor = "";

    sortCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", (e) => {
            sortCheckboxes.forEach(cb => {
                if (cb !== e.target) cb.checked = false;
            });

            selectedSortOption = e.target.checked ? e.target.parentElement.textContent.trim() : null;
            filterButton.disabled = !hasActiveFilters();
        });
    });

    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", updateSelectedFilters);
    });

    colorInput.addEventListener("input", () => {
        selectedColor = colorInput.value.trim().toLowerCase();
        filterButton.disabled = !hasActiveFilters();
    });

    filterButton.addEventListener("click", (event) => {
        event.preventDefault();  // Förhindrar att sidan laddas om
        console.log("Filtrera-knapp tryckt!");
        updateSelectedFilters();
        console.log("Selected filters:", selectedFilters, "Selected color:", selectedColor);
    
        if (selectedFilters.length === 0 && selectedColor.length === 0 && !selectedSortOption) {
            console.log("Inga filter eller sortering valda, laddar om sidan");
            window.location.reload(); // Ladda om sidan om inga filter och ingen sortering är valda
        } else {
            console.log("Filter appliceras...");
            if (selectedFilters.length > 0 || selectedColor.length > 0) {
                filterProducts(selectedFilters, selectedColor);
            }
            if (selectedSortOption) {
                sortProducts(selectedSortOption);
            }
        }
    });
    
    
    

    resetButton.addEventListener("click", () => {
        console.log("Laddar om sidan...");
        window.location.reload(); // Återställ sidan och visa alla produkter
    });

    function updateSelectedFilters() {
        selectedFilters = Array.from(filterCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.parentElement.textContent.trim());
        filterButton.disabled = !hasActiveFilters();
    }

    function hasActiveFilters() {
        return selectedFilters.length > 0 || selectedColor.length > 0 || selectedSortOption;
    }

    function filterProducts(filters, color) {
        const products = document.querySelectorAll(".product-card");
        let anyMatch = false;

        products.forEach(product => {
            const brand = product.querySelector(".product-brand-price span:first-child")?.textContent.trim().toLowerCase() || "";
            const size = product.querySelector(".product-size")?.textContent.trim().toLowerCase() || "";
            const productColor = product.dataset.color?.toLowerCase() || "";
            const condition = product.dataset.condition?.toLowerCase() || "";

            let matches = true;

            if (filters.length > 0) {
                matches = filters.some(filter =>
                    brand === filter.toLowerCase() ||
                    size === filter.toLowerCase() ||
                    condition === filter.toLowerCase()
                );
            }

            if (color.length > 0) {
                matches = matches && productColor.includes(color);
            }

            product.style.display = matches ? "block" : "none";
            if (matches) anyMatch = true;
        });

        if (!anyMatch) {
            hideAllProducts(); // Om ingen produkt matchar, dölja alla produkter
        }
    }

    function hideAllProducts() {
        document.querySelectorAll(".product-card").forEach(product => {
            product.style.display = "none"; // Dölj alla produkter
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

        productContainer.innerHTML = "";
        products.forEach(product => productContainer.appendChild(product));
    }
});
















