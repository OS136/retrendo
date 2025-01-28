document.addEventListener("DOMContentLoaded", function () {
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
          alert("Produkten har lagts till i varukorgen");
          window.location.href = "/cart"; // Ändra från reload till specifik URL
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
          if (data.success) window.location.reload();
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
