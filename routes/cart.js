const express = require("express");
const router = express.Router();
const Database = require('better-sqlite3');
const db = new Database('./db/Retrendo.db');

router.get("/", (req, res) => {
    const cart = req.session.cart || [];
    const total = cart.reduce((sum, item) => sum + Number(item.price), 0);
    res.render("cart", { cart, total });
  });

router.post("/add/:slug", (req, res) => {
  const product = db.prepare("SELECT * FROM products WHERE slug = ?").get(req.params.slug);
  if (!req.session.cart) req.session.cart = [];
  req.session.cart.push(product);
  res.json({ success: true, count: req.session.cart.length });
});

router.post("/remove/:id", (req, res) => {
    if (!req.session.cart) return res.json({ success: false });
    req.session.cart = req.session.cart.filter(item => item.id !== parseInt(req.params.id));
    res.json({ success: true });
  });
module.exports = router; 