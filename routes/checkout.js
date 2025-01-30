var express = require("express");
var router = express.Router();
var path = require("path");
const sqlite3 = require("sqlite3").verbose();
const Database = require("better-sqlite3");
const db = new Database("./db/Retrendo.db", { verbose: console.log });

//GET /checkout
router.get('/', function(request, response){
    // Hämta ut cart från sessionen och lägger värdet i basket
let basket = request.session.cart ?? [];

response.render("checkout", {
    title: 'Checkout',
    basket,
});
});

//INKOMMANDE POST
router.post("/", function (request, response) {
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
        INSER INTO orders(customer_id, created_at)
        VALUES (@customerId, datetime('now'))
        `);
        const resultInsertOrder = insertOrder.run({customerId});
        const orderId = resultInsertOrder.lastInsertRowid;

            //hämta varukorgen från sessionen
        const basket = request.session.cart ?? [];
            // skapa SQL-fråga som vi kan köra för varje produkt i varukorgen
            const insertOrderLine = db.prepare(`
                INSERT INTO order_lines (order_id, product_id, quantity)
                VALUES (@orderId, @productId, @quantity)
                `);
                   
                basket.forEach(basketItem => {

                    const orderLine = {
                        orderId,
                        productId: basketItem.product.id,
                        quantity: basketItem.quantity,
                    };
                    insertOrderLine.run(orderLine)
                    
                });

                // tömmer varukorgen
                request.session.basket = [];
                
    response.redirect("/checkout/confirmation")
});
// När man klickar på knappen "Lägg i varukorg" på detaljsidan skickas
// ett POST-anrop till /basket, vilket vi hanterar med denna route.
/*router.post("/", function (req, res) {

    // värdet av <input type="hidden" name="productId"> 
    // är tillgängligt via req.body.productId.
const productId = req.body.productId;

    // testar att skriva ut värdet i konsollen
    // men först måste du koppla in routen i app.js
console.log(productId);

    // Lagra produkten i sessionsvariablen "basket" - som 
    // kommer vara en array. Om arrayn inte redan finns, skapas den.
    // .session efter req är vår session data/information 
    // och denna kan vi se som en låda där varje användare har sin egen låda
    // där produkterna läggs ner i. 
let basket = req.session.basket ?? [];
let cart = req.session.cart ?? [];
vad den heter på sidan

    // sök efter produkten i varukorgen. basket är en array
    // som innehåller basketItem. en basketitem är ett objekt som 
    // håller en referens till produkt samt kvantiteten/antalet av denna
let basketItem = basket.find(x => x.product.id == productId);

if(basketItem){
    // finns produkten i varukorgen, öka antalet med 1
    basketItem.quantity += 1;
}else{

    const product = db.prepare(`
        SELECT 
        id, 
        name,
        description,
        price
        FROM products
        WHERE id = ?
        `).get(productId);

            // finns produkten INTE i varukorgen, 
            // lägg till produkten
        basketItem = {
            product,
            quantity: 1
        }

        // Lägg till basketIteam till varukorgen
        basket.push(basketItem);

        //Lagra varukorgen i sessionen, 
        // så att den finns tillgänglig 
        // nästa gång ett anrop kommer 
        // in från samma användare.
        req.session.basket = basket;

}

    // Instruera webbläsaren att hämta detaljsidan på nytt 
    // att vi står kvar på detaljsidan efter att ha tryckt 
    // på knappen.
    // Denna kod gör att webbläsaren 
    // laddar om sidan som den kom ifrån
res.redirect('back');
});

//nu behöver vi hämta middlewear som skapar en session som kan hålla informationen
// vilket är vad användaren trycker på i detta fallet.
// använd npm install express-session i terminalen
// koppla sen in sessionen i app.js med
// var session = require('express-session');
*/
router.get('/homepage', function(request, response){

    response.render("homepage");
    });


module.exports = router;