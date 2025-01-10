var express = require("express");
var router = express.Router();
var path = require("path");
const sqlite3 = require("sqlite3").verbose();

// const dbfilePath = path.resolve(process.cwd(), "./db/products.db");

// Ger oss tillgång till databasen
// const db = new sqlite3.Database(dbfilePath, sqlite3.OPEN_READWRITE, (err) => {
//   if (err) return console.error(err.message);
// });

// GET /
router.get("/", function (request, response) {
response.render("startsida"); // Detta renderar index.ejs
});
module.exports = router;
