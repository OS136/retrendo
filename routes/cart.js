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






router.get("/checkout", (request, response)=>{
  const cart = request.session.cart || [];
  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);
  
  if (cart.length === 0){
    //sänder användaren till cart om den är tom
    return response.redirect("/cart");
  }
  response.render("checkout", {cart, total})
  console.log('cartsidan',cart)
});

router.post("/checkout", function (request, response) {
  try{
      const customer = {
          firstName: request.body.firstName,
          lastName: request.body.lastName,
          street: request.body.street,
          zip: request.body.zip,
          city: request.body.city,
          phone: request.body.phone,
          email: request.body.email,
          newsletter: request.body.checkbox === "on" ? 1 : 0
      };

      const insertCustomer = db.prepare(`
          INSERT INTO customers(firstName, lastName, street, zip, city, phone, email, newsletter)
          VALUES(@firstName, @lastName, @street, @zip, @city, @phone, @email, @newsletter)
          `);

      const resultInsertCustomer = insertCustomer.run(customer);
      
      const customerId = resultInsertCustomer.lastInsertRowid;

      const insertOrder = db.prepare(`
          INSERT INTO orders(customer_id, created_at)
          VALUES (@customerId, datetime('now'))
          `);
      const resultInsertOrder = insertOrder.run({customerId});
      const orderId = resultInsertOrder.lastInsertRowid;

              //hämta varukorgen från sessionen
          const cart = request.session.cart ?? [];
              // skapa SQL-fråga som vi kan köra för varje produkt i varukorgen
          const insertOrderLine = db.prepare(`
                  INSERT INTO order_lines (order_id, product_id, price)
                  VALUES (@orderId, @productId, @price)
                  `);
                  
                  cart.forEach(basketItem => {

                      const orderLine = {
                          orderId,
                          productId: basketItem.product ? basketItem.product.id : basketItem.id,
                          price: basketItem.price,
                      };
                      insertOrderLine.run(orderLine)
                      
                  });

                  // tömmer varukorgen
                  request.session.cart = [];

  response.redirect("/checkout/confirmation");
}catch (error){
  console.error("Fel vid beställning:", error);
  response.status(500).send("Ett fel uppstod vid beställningen.");
}
});

module.exports = router;
