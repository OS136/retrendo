document.addEventListener("DOMContentLoaded", function () {
  const favorites = getStoredFavorites();

  if (favorites.length > 0) {
    addFavoriteBadge(favorites.length);
  }

  document.querySelectorAll(".heart").forEach((heart) => {
    const path = heart.querySelector("path");
    // sätt default värde på varje heart vid on load
    presetFavorite(favorites.includes(heart.id), path);

    heart.addEventListener("click", function (e) {
      e.preventDefault();
      if (path.getAttribute("fill") === "none") {
        addToFavorite(favorites, path, heart.id);
        return;
      }
      removeFromFavorite(favorites, path, heart.id);
    });
  });

  // Varukorg och checkout knappar
  document
    .querySelector(".add")
    ?.addEventListener("click", () =>
      alert("Produkten har lagts till i varukorgen")
    );

  document
    .querySelector(".checkOut")
    ?.addEventListener("click", () => (window.location.href = "/checkout"));

  // Meny-toggle
  const menuIcon = document.querySelector(".menu-icon");
  menuIcon?.addEventListener("click", (e) => {
    e.stopPropagation();
    menuIcon.classList.toggle("open");
  });

  document.addEventListener("click", () => menuIcon?.classList.remove("open"));
});

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

function getStoredFavorites() {
  // bara för säkerrhetens skull
  if (localStorage.getItem("favorites") === "") return [];

  return localStorage.getItem("favorites")?.split(",") || [];
}

function presetFavorite(isFavorite, path) {
  // Om favoriten finns i localstorage, sätt till röd
  if (isFavorite) {
    path.setAttribute("fill", "red");
    path.setAttribute("stroke", "none");
    return;
  }
  // Annars gör hjärtat till ett tomt hjärta
  path.setAttribute("fill", "none"); // Tomt hjärta
  path.setAttribute("stroke", "black"); // Svart outline
  path.setAttribute("stroke-width", "2");
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
    const repsonse = await fetch("/favorites", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ favorites: favorites }),
    });

    if (!repsonse.ok) {
      throw new Error("Can not go to favorites page");
    }

    document.querySelectorAll(".product").forEach((product) => {
      if (!favorites.includes(product.id)) {
        product.remove();
      }
    });
  }

  document.querySelector("#favorites-badge").textContent = favorites.length;

  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "black");

  if (favorites.length === 0) {
    localStorage.removeItem("favorites");
    const favoriteBadge = document.querySelector("#favorites-badge");
    if (favoriteBadge) {
      favoriteBadge.remove();

      updateFavoritesLink("remove");
    }
  }
}

function addFavoriteBadge(count) {
  const favoritesBadge = document.createElement("span");
  favoritesBadge.id = "favorites-badge";
  favoritesBadge.textContent = count;
  document.querySelector(".favorite").appendChild(favoritesBadge);
  updateFavoritesLink();
}

function updateLocalStorage(favorites) {
  localStorage.setItem("favorites", favorites);
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
          "Content-Type": "application/json", // Set content-type to application/json
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

  // Add or remove the 'href' attribute and event listener
  if (setFavorite === "remove") {
    // favoritesAnchor.removeAttribute("href");
    favoritesAnchor.removeEventListener("click", handleClick); // Remove the click event listener
  } else {
    // favoritesAnchor.setAttribute("href", "/favorites");
    favoritesAnchor.addEventListener("click", handleClick); // Add the click event listener
  }
}
