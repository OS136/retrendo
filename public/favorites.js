document.addEventListener("DOMContentLoaded", function () {
  const observer = new MutationObserver(() => {
    console.log("DOM changed, checking categories...");

    const damCategory = document.querySelector("#dam-category .products-grid");
    const herrCategory = document.querySelector(
      "#herr-category .products-grid"
    );
    const electronicCategory = document.querySelector(
      "#electronic-category .products-grid"
    );

    removeIfEmpty(damCategory);
    removeIfEmpty(herrCategory);
    removeIfEmpty(electronicCategory);

    // Check for empty favorites
    if (
      !localStorage.getItem("favorites") ||
      localStorage.getItem("favorites") === "[]"
    ) {
      const header = document.querySelector(".recently-added h2"); // Corrected selector
      if (header && !document.querySelector(".no-favorites-message")) {
        const noProducts = document.createElement("p");
        noProducts.classList.add("no-favorites-message");
        noProducts.textContent = "Du har inga favoriter..😔";
        header.appendChild(noProducts);
      }
    }
  });

  // Observe the entire body for changes in child elements
  observer.observe(document.body, { childList: true, subtree: true });

  function removeIfEmpty(category) {
    if (category && category.children.length === 0) {
      // Remove the element before this category
      if (category.previousElementSibling) {
        category.previousElementSibling.remove();
      }
      // Remove the category itself
      category.remove();
    }
  }
});
