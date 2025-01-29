var express = require("express");
var router = express.Router();
var path = require("path");
const zlib = require("zlib"); // compress files
const { formatProducts } = require("./admin");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(
  path.join(__dirname, "../db/Retrendo.db"),
  (err) => {
    if (err) {
      console.error("Error connecting to database:", err);
    } else {
      console.log("Connected to database successfully");
    }
  }
);

router.delete("/", (req, res) => {
  const favoritesBody = req.body.favorites.join(",");
  req.session.favorites = favoritesBody;
  res.json({ favorites: req.session.favorites.split(",") });
});

router.post("/", (req, res) => {
  const favoritesBody = req.body.favorites.join(",");
  req.session.favorites = favoritesBody;
  renderFavoritesPage(req, res);
});
// GET /
router.get("/", (req, res) => {
  renderFavoritesPage(req, res);
});

function renderFavoritesPage(req, res) {
  const favoriteIdList = req.session.favorites || "";

  if (favoriteIdList === "") {
    res.redirect("/");
  }
  const favoritesQuery = `
  SELECT * FROM products 
  WHERE id IN(${favoriteIdList})
  ORDER BY created_at DESC
`;
  db.all(favoritesQuery, [], (err, favoriteProducts) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).send("Error fetching products");
      return;
    }

    const formattedProducts = formatProducts(favoriteProducts);

    const categories = formattedProducts.map((product) => product.category);
    const containsCategories = {
      dam: categories.includes("Dam"),
      herr: categories.includes("Herr"),
      elektronik: categories.includes("Elektronik"),
    };

    res.render("favorites", {
      favoriteProducts: formattedProducts,
      containsCategories: containsCategories,
    });
  });
}

module.exports = router;
