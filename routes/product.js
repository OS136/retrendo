var express = require("express");
var router = express.Router();
const Database = require('better-sqlite3');

// Database connection
const db = new Database('./db/Retrendo.db', { verbose: console.log });


// Default product details page
router.get("/", (req, res) => {
  try {
    const product = {
      name: "Testprodukt",
      price: "100 SEK",
      product_type: "Tröja",
      color: "Blå",
      size: "M",
      brand: "Testmärke",
      condition: "Ny",
      description: "Det här är en testprodukt.",
      news: "true"
    };
    
    console.log(product);  // Logga objektet för att säkerställa att det skickas korrekt
    
    res.render('productdetails', { 
      title: 'Product Details',
      product: product
    });
  } catch (error) { 
    console.error("Route error:", error);
    res.status(500).send("Server error");
  }
});


// Specific product by slug
router.get('/:slug', (req, res) => {
  try {
    const selectProduct = db.prepare(`
      SELECT
        name, product_type, color, price, size, 
        brand, condition, image, description, 
        slug, category, created_at
      FROM products 
      WHERE slug = ?
    `);
   
    const Product = selectProduct.get(req.params.slug);
    
    if (!Product) {
      return res.status(404).send("Product not found");
    }

    const isNew = Product.created_at ? 
      ((Date.now() - new Date(Product.created_at).getTime()) / (1000 * 3600 * 24)) <= 30 
      : false;

    res.render('product', { 
      product: Product, 
      isNew: isNew 
    });
  } catch (error) {
    console.error("Product fetch error:", error);
    res.status(500).send("Server error");
  }
});

// Similar products
router.get('/:slug/similar', (req, res) => {
  console.log("Similar products request - Slug:", req.params.slug);
  try {
    const selectProduct = db.prepare(`
      SELECT 
        name, product_type, color, price, size, 
        brand, condition, image, description, 
        slug, category
      FROM products 
      WHERE slug = ?
    `);
    
    const Product = selectProduct.get(req.params.slug);

    if (!Product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const selectSimilar = db.prepare(`
      SELECT 
        name, product_type, color, price, size, 
        brand, condition, image, description, 
        slug, category
      FROM products 
      WHERE category = ?
      AND product_type = ?
      AND slug != ? 
      LIMIT 4
    `);

    const similarProducts = selectSimilar.all(
      Product.category, 
      Product.product_type, 
      req.params.slug
    );

    res.json(similarProducts);
  } catch (error) {
    console.error("Similar products error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
