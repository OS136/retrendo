var express = require("express");
var router = express.Router();
const path = require("path");
var sqlite3 = require("sqlite3").verbose();
const zlib = require("zlib");

// Route för att visa Dam-kategorin
/*router.get("/dam", function (req, res, next) {
   console.log("Route /dam anropas");
  const query = "SELECT * FROM products WHERE category = 'Dam'"; // Kategorin är 'Dam'
  db.all(query, [], (err, products) => {
    if (err) {
      console.error("Fel vid hämtning av produkter:", err.message);
      return res.status(500).send("Fel vid hämtning av data");
    } else {
      res.render("categorieswoman", { products }); // Skickar produkterna till vyn
    }
  });
});*/

const db = new sqlite3.Database(
  path.join(__dirname, "../db/Retrendo.db"),
  (err) => {
    if (err) {
      console.error("Error connecting to database:", err);
    }
  }
);

router.get("/:category", function (req, res) {
  const category =
    req.params.category.charAt(0).toUpperCase() +
    req.params.category.slice(1).toLowerCase();

  const query = "SELECT * FROM products WHERE category = ?";
  db.all(query, [category], (err, products) => {
    if (err) {
      console.error("Fel vid hämtning av produkter:", err.message);
      return res.status(500).send("Fel vid hämtning av data");
    }

    res.render("categorieswoman", {
      products: products,
      categoryName: category,
    });
  });
});

module.exports = router;
