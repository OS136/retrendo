var express = require("express");
var router = express.Router();
const Database = require("better-sqlite3");
const { formatProducts } = require("./admin");
const db = new Database("./db/Retrendo.db", { verbose: console.log });

router.get("/:slug", (req, res) => {
  try {
    const selectProduct = db.prepare(`
        SELECT *, 
        CASE 
          WHEN julianday('now') - julianday(created_at) <= 20 THEN 'true'
          ELSE 'false'
        END as is_new
      FROM products 
      WHERE slug = ?
    `);

    const product = selectProduct.get(req.params.slug);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    const formattedProduct = formatProducts([product])[0];

    const selectSimilar = db.prepare(`
      SELECT * FROM products 
      WHERE category = ? 
      AND slug != ? 
      LIMIT 4
    `);
    const similarProducts = selectSimilar.all(
      product.category,
      req.params.slug
    );

    const formattedSimilarProducts = formatProducts(similarProducts);

    res.render("productdetails", {
      product: formattedProduct,
      similarProducts: formattedSimilarProducts,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
