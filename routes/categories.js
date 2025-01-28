// Modified categories.js route
// categories.js
const express = require("express");
const router = express.Router();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Create database connection directly in categories.js for now
const db = new sqlite3.Database(path.join(__dirname, '..', 'Retrendo.db'), sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to the database successfully");
  }
});

router.get("/dam", function (req, res, next) {
  console.log("Route /dam anropas");
  
  const query = "SELECT * FROM products WHERE category = 'Dam'";
  console.log("Executing query:", query);
  
  db.all(query, [], (err, products) => {
    if (err) {
      console.error("Error fetching products:", err.message);
      return res.status(500).send("Error fetching data");
    }
    
    console.log("Found products:", products);
    res.render("categorieswoman", { products: products || [] });
  });
});

module.exports = router;


