var express = require("express");
var router = express.Router();
var path = require("path");
const sqlite3 = require("sqlite3").verbose();

// const dbfilePath = path.resolve(process.cwd(), "./db/products.db");

// Ger oss tillgång till databasen
// const db = new sqlite3.Database(dbfilePath, sqlite3.OPEN_READWRITE, (err) => {
//   if (err) return console.error(err.message);
// });

// Exempel på statisk produktdata (ersätt detta med din databaslogik senare)
var product = {
    name: "Adidas Träningsbyxor",
    price: "199 sek",
    product_type: "Träningskläder",
    color: "Svart",
    size: "M",
    brand: "Adidas",
    condition: "Ny",
    description: "Komfortabel och hållbar träningsbyxa för alla aktiviteter."
};

// Första routen för startsidan
router.get("/", function (request, response) {
    response.render("startsida"); 
});

router.get("/productdetails", function (request, response) {
    console.log('Sending product details');
    response.render("productdetails", { product: product });
});


module.exports = router;

