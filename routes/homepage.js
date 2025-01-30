var express = require("express");
var router = express.Router();
var path = require("path");
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

// GET /
router.get("/", (req, res) => {
  const recentlyAddedQuery = `
        SELECT * FROM products 
        WHERE created_at >= datetime('now', '-20 days')
        ORDER BY created_at DESC
    `;

  db.all(recentlyAddedQuery, [], (err, recentProducts) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).send("Error fetching products");
      return;
    }

    const formattedProducts = formatProducts(recentProducts);

    res.render("homepage", {
      recentProducts: formattedProducts,
    });
  });
});

router.post("/storeFavorites", (req, res) => {
  const favoriteIdList = req.body.favorites.join(",");
  req.session.favorites = favoriteIdList || req.session?.favorites;
  res.json({ favorites: req.session.favorites });
});

module.exports = router;
