const express = require("express");
const router = express.Router();

// Route to render categorieswoman.ejs
router.get("/", (req, res) => {
   res.render("categorieswoman"); // Use the exact EJS filename
});

module.exports = router;
