var express = require("express");
var router = express.Router();
var path = require("path");
const zlib = require("zlib"); // compress files
const sqlite3 = require("sqlite3").verbose();

// const dbfilePath = path.resolve(process.cwd(), "./db/products.db");

// Ger oss tillgång till databasen
// const db = new sqlite3.Database(dbfilePath, sqlite3.OPEN_READWRITE, (err) => {
//   if (err) return console.error(err.message);
// });

const db = new sqlite3.Database(
  path.join(__dirname, "../db/Retrendo.db"),
  (err) => {
    if (err) {
      console.error("Error connecting to database:", err);
    } else {
      console.log("Connected to database successfully");
    }
  }
);

// GET /
router.get("/", (req, res) => {
  const recentlyAddedQuery = `
        SELECT * FROM products 
        WHERE created_at >= datetime('now', '-20 days')
        ORDER BY created_at DESC
    `;

  db.all(recentlyAddedQuery, [], (err, recentProducts) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).send("Error fetching products");
      return;
    }

    const formattedProducts =
      recentProducts.length > 0
        ? recentProducts.map((product) => {
            if (product.image && typeof product.image !== "string") {
              // Decompress the image
              const decompressedBlob = zlib.brotliDecompressSync(
                Buffer.from(product.image)
              );

              // Convert the image buffer to Base64
              product.image = `data:image/${
                product.image_type
              };charset=utf-8;base64,${decompressedBlob.toString("base64")}`;
            }

            return product;
          })
        : [];

    res.render("homepage", {
      recentProducts: formattedProducts,
    });
  });
});
module.exports = router;
