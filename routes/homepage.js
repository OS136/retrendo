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
    const recentlyAddedQuery = `
        SELECT * FROM products 
        WHERE created_at >= datetime('now', '-20 days')
        ORDER BY created_at DESC
    `;
    
    db.all(recentlyAddedQuery, [], (err, recentProducts) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).send('Error fetching products');
            return;
        }
        res.render('homepage', {
            recentProducts: recentProducts
        });
    });
});
module.exports = router;