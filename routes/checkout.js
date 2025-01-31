var express = require("express");
var router = express.Router();
var path = require("path");
const sqlite3 = require("sqlite3").verbose();
const Database = require("better-sqlite3");
const db = new Database("./db/Retrendo.db", { verbose: console.log });

//GET /checkout
router.get('/', function(request, response){
    // Hämta ut cart från sessionen och lägger värdet i basket
const cart = request.session.cart ?? [];

console.log("checkoutsidan:", request.session.cart);
response.render("checkout", {
    title: 'Checkout',
    cart,
});
});

//INKOMMANDE POST
router.post("/", function (request, response) {
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
                    INSERT INTO order_lines (order_id, product_id, quantity)
                    VALUES (@orderId, @productId, @quantity)
                    `);
                    
                    cart.forEach(basketItem => {

                        const orderLine = {
                            orderId,
                            productId: basketItem.product ? basketItem.product.id : basketItem.id,
                            price: basketItem.quantity,
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

router.get('/homepage', function(request, response){

    response.render("homepage");
    });


module.exports = router;