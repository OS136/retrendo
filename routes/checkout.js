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

router.get('/homepage', function(request, response){

    response.render("homepage");
    });


module.exports = router;