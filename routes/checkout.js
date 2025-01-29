var express = require("express");
var router = express.Router();
var path = require("path");
const sqlite3 = require("sqlite3").verbose();

// GET /
//router.get("/", function (request, response) {
  //  response.render("checkout"); 
//});
//INKOMMANDE POST

//GET /basket
router.get('/', function(request, response){
    // Hämta ut basket från sessionen -om den inte finns kommer vi få 
    // undefined tillbaka. vi använder den så kallade 
    // Mullish coalescing operator is a logical operator that returns 
    // its right-hand side operand when its left-hand side operand is 
    // null eller undefined, annars returnerar den operanden till vänster
//let basket = request.session.basket ?? [];

response.render("checkout", {
    title: 'Checkout',
    //basket,
});
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
// var session = require('express-session);
*/
router.get('/homepage', function(request, response){

    response.render("homepage");
    });
module.exports = router;