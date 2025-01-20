var express = require("express");
var router = express.Router();
const Database = require('better-sqlite3');
const db = new Database('./db/Retrendo.db', {verbose: console.log});



// GET /
router.get("/", function (request, response) {
  
  response.render('product', {title: 'product'});
});


// Route för vald/visad Produkt
router.get('/:slug', (req, res) => {
  const slug = req.params.slug;

  const selectProduct = db.prepare(`
    SELECT
      name,
      product_type, 
      color, 
      price, 
      size, 
      brand, 
      condition, 
      image, 
      description, 
      slug, 
      category 
    FROM products 
    WHERE slug = ?
  `);

  const Product = selectProduct.get(slug);

  if (!Product) {
    return res.status(404).send("Produkten hittades inte");
  }

  res.render('product', { product: Product });
});

// 2. Route till liknande produkter / och tar bort vald produkt från liknande
router.get('/:slug/similar', (req, res) => {
  const slug = req.params.slug;

  // Aktuellprodukt som visas
  const selectProduct = db.prepare(`
    SELECT 
      name,
      product_type, 
      color, 
      price, 
      size, 
      brand, 
      condition, 
      image, 
      description, 
      slug, 
      category
    FROM products 
    WHERE slug = ?
  `);
  const Product = selectProduct.get(slug);

  if (!Product) {
    return res.status(404).json({ error: "Produkten hittades inte." });
  }

  // Hämta liknande produkter med kategorin
  const selectSimilar = db.prepare(`
    SELECT 
        name,
        product_type, 
        color, 
        price, 
        size, 
        brand, 
        condition, 
        image, 
        description, 
        slug, 
        category
    FROM products 
    WHERE category = ? 
      AND slug != ? 
    LIMIT 4
  `);

  const similarProducts = selectSimilar.all(Product.category, slug);

  res.json(similarProducts);
});

module.exports = router;

