var express = require("express");
var router = express.Router();
var path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbfilePath = path.resolve(process.cwd(), "./db/Retrendo.db");

// Ger oss tillgång till databasen
const db = new sqlite3.Database(dbfilePath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);
});

// GET /
router.get("/", function (request, response) {
  response.render("admin/newProduct");
});

router.post("/", function (req, res) {
  const {
    productName,
    productType,
    productColor,
    productPrice,
    productSize,
    productBrand,
    productCondition,
    productPicture,
    productDescription,
    productSlug,
    productCategories,
    productDate,
  } = req.body;

  const insert = db.prepare(`
    INSERT INTO products (
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
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
    
  `);

  insert.run(
    [
      productName,
      productType,
      productColor,
      productPrice,
      productSize,
      productBrand,
      productCondition,
      productPicture,
      productDescription,
      productSlug,
      productCategories,
      productDate,
    ],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).send("Failed to add product");
      }
      res.status(200).send("Product added");
    }
  );
  insert.finalize();
});

module.exports = router;
