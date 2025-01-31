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

  // Hjärtfunktioner från main-branchen
  function getStoredFavorites() {
    if (localStorage.getItem("favorites") === "") return [];
    return localStorage.getItem("favorites")?.split(",") || [];
  }

  function presetFavorite(isFavorite, path) {
    if (isFavorite) {
      path.setAttribute("fill", "red");
      path.setAttribute("stroke", "none");
      return;
    }
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "black");
    path.setAttribute("stroke-width", "2");
  }

  function updateLocalStorage(favorites) {
    localStorage.setItem("favorites", favorites);
  }

  function addFavoriteBadge(count) {
    const favoritesBadge = document.createElement("span");
    favoritesBadge.id = "favorites-badge";
    favoritesBadge.textContent = count;
    document.querySelector(".favorite").appendChild(favoritesBadge);
    updateFavoritesLink();
  }

  function addToFavorite(favorites, path, addToFavorite) {
    favorites.push(addToFavorite);
    updateLocalStorage(favorites);

    path.setAttribute("fill", "red");
    path.setAttribute("stroke", "none");

    const favoriteBadge = document.querySelector("#favorites-badge");
    if (!favoriteBadge) {
      addFavoriteBadge(favorites.length);
    } else {
      favoriteBadge.textContent = favorites.length;
    }
  }

  async function removeFromFavorite(favorites, path, removeFavorite) {
    favorites.splice(favorites.indexOf(removeFavorite), 1);
    updateLocalStorage(favorites);

    if (window.location.pathname === "/favorites") {
      const response = await fetch("/favorites", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ favorites: favorites }),
      });

      if (!response.ok) {
        throw new Error("Can not go to favorites page");
      }

      document.querySelectorAll(".product").forEach((product) => {
        if (!favorites.includes(product.id)) {
          product.remove();
        }
      });
    }

    const favoriteBadge = document.querySelector("#favorites-badge");
    if (favoriteBadge) {
      favoriteBadge.textContent = favorites.length;

      if (favorites.length === 0) {
        favoriteBadge.remove();
        updateFavoritesLink("remove");
      }
    }

    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "black");
  }

  function updateFavoritesLink(setFavorite = "add") {
    const favoritesAnchor = document.querySelector(".favorite a");

    const handleClick = async (event) => {
      if (setFavorite === "remove") {
        event.preventDefault();
      } else {
        const currentFavorites = getStoredFavorites();
        const response = await fetch("/storeFavorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ favorites: currentFavorites }),
        });

        if (!response.ok) {
          throw new Error("Can not go to favorites page");
        } else {
          window.location.href = "/favorites";
        }
      }
    };

    if (setFavorite === "remove") {
      favoritesAnchor.removeEventListener("click", handleClick);
    } else {
      favoritesAnchor.addEventListener("click", handleClick);
    }
  }

  // Initialisera favoriter
  const favorites = getStoredFavorites();
  if (favorites.length > 0) {
    addFavoriteBadge(favorites.length);
  }

  // Hantera hjärtan
  document.querySelectorAll(".heart").forEach((heart) => {
    const path = heart.querySelector("path");

    // Återställ hjärtans utseende baserat på favoriter
    presetFavorite(favorites.includes(heart.id), path);

    heart.addEventListener("click", function (e) {
      e.preventDefault();

      if (path.getAttribute("fill") === "none") {
        addToFavorite(favorites, path, heart.id);
      } else {
        removeFromFavorite(favorites, path, heart.id);
      }
    });
  });

  // Varukorg-hantering
  document.querySelector(".add")?.addEventListener("click", function (e) {
    e.preventDefault();
    const slug = window.location.pathname.split("/").pop();
    fetch(`/cart/add/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Update cart badge
          updateCartBadge();

          alert("Produkten har lagts till i varukorgen");
          window.location.href = "/cart";
        }
      })
      .catch((error) => console.error("Error:", error));
  });

  // Ta bort från varukorg
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = this.dataset.id;
      fetch(`/cart/remove/${id}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            // Update cart badge
            updateCartBadge();
            window.location.reload();
          }
        });
    });
  });

  // Meny-toggle
  document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.querySelector(".menu-icon");

    menuIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      menuIcon.classList.toggle("open");
    });

    document.addEventListener("click", () => {
      menuIcon.classList.remove("open");
    });
  });

  // Initialt anrop för att uppdatera cart badge
  updateCartBadge();
});
