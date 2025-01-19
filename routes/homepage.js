var express = require("express");
var router = express.Router();
var path = require("path");
const sqlite3 = require("sqlite3").verbose();

// const dbfilePath = path.resolve(process.cwd(), "./db/products.db");

// Ger oss tillgång till databasen
// const db = new sqlite3.Database(dbfilePath, sqlite3.OPEN_READWRITE, (err) => {
//   if (err) return console.error(err.message);
// });


const db = new sqlite3.Database(path.join(__dirname, '../db/Retrendo.db'), (err) => {
  if (err) {
      console.error('Error connecting to database:', err);
  } else {
      console.log('Connected to database successfully');
  }
});

// GET /
router.get("/", (req, res) => {
    // Hämta damkläder
    const damQuery = "SELECT * FROM products WHERE category = 'Dam' LIMIT 6";
    // Hämta elektronik
    const electronicQuery = "SELECT * FROM products WHERE category = 'Elektronik' LIMIT 2";
    
    Promise.all([
        new Promise((resolve, reject) => {
            db.all(damQuery, [], (err, damProducts) => {
                if (err) reject(err);
                resolve(damProducts);
            });
        }),
        new Promise((resolve, reject) => {
            db.all(electronicQuery, [], (err, electronicProducts) => {
                if (err) reject(err);
                resolve(electronicProducts);
            });
        })
    ])
    .then(([damProducts, electronicProducts]) => {
        res.render('homepage', {
            damProducts: damProducts,
            electronicProducts: electronicProducts
        });
    })
    .catch(err => {
        console.error('Database error:', err);
        res.status(500).send('Error fetching products');
    });
});

module.exports = router;





  module.exports = router;