const express = require("express");
const router = express.Router();
const Database = require("better-sqlite3");
var path = require("path");
//const { request, response } = require("../app");
const db = new Database("./db/Retrendo.db");

router.get("/", (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);
  res.render("cart", {
    cart,
    total,
    cartCount: cart.length, // Pass cart count to the template
  });
});

router.get("/count", (req, res) => {
  const cart = req.session.cart || [];
  res.json({ count: cart.length });
});

router.post("/add/:slug", (req, res) => {
  const product = db
    .prepare("SELECT * FROM products WHERE slug = ?")
    .get(req.params.slug);
  if (!req.session.cart) req.session.cart = [];
  req.session.cart.push(product);
  res.json({
    success: true,
    count: req.session.cart.length,
    product: product,
  });
});

router.post("/remove/:id", (req, res) => {
  if (!req.session.cart) return res.json({ success: false });
  req.session.cart = req.session.cart.filter(
    (item) => item.id !== parseInt(req.params.id)
  );
  res.json({
    success: true,
    count: req.session.cart.length,
  });
});






router.get("/check", (request, response)=>{
  const cart = request.session.cart || [];
  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);
  
  if (cart.length === 0){
    //sänder användaren till cart om den är tom
    return response.redirect("/cart");
  }
  response.render("checkout", {cart, total})
  console.log('cartsidan',cart)
})
module.exports = router;
