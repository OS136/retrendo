document.addEventListener("DOMContentLoaded", function () {
  // Funktion för att uppdatera cart badge
  function updateCartBadge() {
    fetch("/cart/count")
      .then((response) => response.json())
      .then((data) => {
        const basketIcon = document.querySelector(".varukorg-icon");

        // Ta bort befintlig badge
        const existingBadge = basketIcon.querySelector(".cart-badge");
        if (existingBadge) {
          existingBadge.remove();
        }

        // Lägg till badge om cart count > 0
        if (data.count > 0) {
          const badge = document.createElement("span");
          badge.className = "cart-badge";
          badge.textContent = data.count;
          basketIcon.appendChild(badge);
        }
      })
      .catch((error) => {
        console.error("Error fetching cart count:", error);
      });
  }

  // Call updateCartBadge on page load
  updateCartBadge();

  document.querySelectorAll(".heart").forEach((heart) => {
    const path = heart.querySelector("path");
    path.setAttribute("fill", "none"); // Tom i början
    path.setAttribute("stroke", "black"); // Svart outline
    path.setAttribute("stroke-width", "2");

    heart.addEventListener("click", function (e) {
      e.preventDefault();
      if (path.getAttribute("fill") === "none") {
        path.setAttribute("fill", "red");
        path.setAttribute("stroke", "none");
      } else {
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "black");
      }
    });
  });

  // Varukorg-hantering
  document.querySelector(".add")?.addEventListener("click", function (e) {
    e.preventDefault(); // Lägg till detta
    const slug = window.location.pathname.split("/").pop();
    fetch(`/cart/add/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Update localStorage cart count
          const currentCount = parseInt(
            localStorage.getItem("cartCount") || "0"
          );
          localStorage.setItem("cartCount", (currentCount + 1).toString());

          // Update cart badge
          updateCartBadge();

          alert("Produkten har lagts till i varukorgen");
          window.location.href = "/cart";
        }
      })
      .catch((error) => console.error("Error:", error));
  });

  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = this.dataset.id;
      fetch(`/cart/remove/${id}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            // Decrease localStorage cart count
            const currentCount = parseInt(
              localStorage.getItem("cartCount") || "0"
            );
            localStorage.setItem(
              "cartCount",
              Math.max(0, currentCount - 1).toString()
            );

            // Update cart badge
            updateCartBadge();

            window.location.reload();
          }
        });
    });
  });

  // Meny-toggle
  const menuIcon = document.querySelector(".menu-icon");
  menuIcon?.addEventListener("click", (e) => {
    e.stopPropagation();
    menuIcon.classList.toggle("open");
  });

  document.addEventListener("click", () => menuIcon?.classList.remove("open"));
});
