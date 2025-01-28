var express = require("express");
var router = express.Router();
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("./Retrendo.db");

// Route för att visa Dam-kategorin
router.get("/dam", function (req, res, next) {
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
});



module.exports = router;


