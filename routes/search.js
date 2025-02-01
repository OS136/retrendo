const express = require("express");
const router = express.Router();
const Database = require("better-sqlite3");
const db = new Database("./db/Retrendo.db");

router.get("/", (req, res) => {
  const searchQuery = req.query.search;
  const query = db.prepare(`
        SELECT * FROM products 
        WHERE name LIKE ? 
        OR brand LIKE ? 
        OR product_type LIKE ?
    `);

  const searchTerm = `%${searchQuery}%`;
  const results = query.all(searchTerm, searchTerm, searchTerm);

  res.render("categories", {
    products: results,
    categoryName: `Sökresultat för "${searchQuery}"`,
    noResults: results.length === 0,
  });
});

module.exports = router;
