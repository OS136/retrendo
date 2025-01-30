
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
const filterButton = document.getElementById("apply-filters");

let selectedSortOption = null;
let selectedFilters = [];

// Handle sort options (mutually exclusive)
sortCheckboxes.forEach(checkbox => {
checkbox.addEventListener("change", (e) => {
    // Uncheck other sort options
    sortCheckboxes.forEach(cb => {
        if (cb !== e.target) cb.checked = false;
    });
    
    selectedSortOption = e.target.checked ? e.target.parentElement.textContent.trim() : null;
    console.log("Selected sort option:", selectedSortOption);
    
    // Enable button if either sort or filters are selected
    const hasFilters = Array.from(filterCheckboxes).some(cb => cb.checked);
    filterButton.disabled = !hasFilters && !selectedSortOption;
});
});

// Handle filter options (multiple can be selected)
filterCheckboxes.forEach(checkbox => {
checkbox.addEventListener("change", () => {
    selectedFilters = Array.from(filterCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.parentElement.textContent.trim());

    // Enable button if either sort or filters are selected
    filterButton.disabled = selectedFilters.length === 0 && !selectedSortOption;
    console.log("Selected filters:", selectedFilters);
});
});

// Apply filters and sort when button is clicked
filterButton.addEventListener("click", () => {
if (selectedFilters.length > 0) {
    filterProducts(selectedFilters);
}
if (selectedSortOption) {
    sortProducts(selectedSortOption);
}
});

function filterProducts(filters) {
const products = document.querySelectorAll(".product-card");

products.forEach(product => {
    const brand = product.querySelector(".product-brand-price span:first-child")?.textContent.trim() || "";
    const size = product.querySelector(".product-size")?.textContent.trim() || "";
    const color = product.dataset.color || "";
    const condition = product.dataset.condition || "";

    // Show product if it matches ANY of the selected filters within their respective categories
    let matches = true;
    
    if (filters.length > 0) {
        matches = filters.some(filter => 
            brand === filter ||
            size === filter ||
            color === filter ||
            condition === filter
        );
    }

    product.style.display = matches ? "block" : "none";
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

// Clear and reappend sorted products
productContainer.innerHTML = "";
products.forEach(product => productContainer.appendChild(product));
}
});
