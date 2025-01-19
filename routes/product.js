var express = require("express");
var router = express.Router();
const Database = require('better-sqlite3');
const db = new Database('./db/Retrendo.db', {verbose: console.log});



// GET /
router.get("/", function (request, response) {
  response.render('product', {title: 'product'});
});

router.get('/product/:urlslug', function(req, res, next) {
      const slug = req.params.urlslug;
      console.log('slug:',slug);

  const product = db.prepare(`
    SELECT
    id,
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
    category, 
    date
    
  FROM products
  WHERE slug = ?
  `).get(slug);
  console.log(product);
  if(!product) {
    res.status(404).json({error: "Product not found"});
  }
  else{
     res.json(product);
  }   
});

module.exports = router;