var express = require("express");
var router = express.Router();
var path = require("path");
const sqlite3 = require("sqlite3").verbose();



router.get('/', function(request, response){

response.render("confirmation", {
    title: 'Confirmation'
});
});

module.exports = router;