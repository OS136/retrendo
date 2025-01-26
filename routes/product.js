var express = require("express");
var router = express.Router();
const Database = require('better-sqlite3');
const db = new Database('./db/Retrendo.db', { verbose: console.log });

router.get('/:slug', (req, res) => {
  try {
    const selectProduct = db.prepare(`
      SELECT * FROM products WHERE slug = ?
    `);
    
    const product = selectProduct.get(req.params.slug);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    const selectSimilar = db.prepare(`
      SELECT * FROM products 
      WHERE category = ? 
      AND slug != ? 
      LIMIT 4
    `);
    const similarProducts = selectSimilar.all(product.category, req.params.slug);

    res.render('productdetails', { 
      product: product,
      similarProducts: similarProducts 
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;

