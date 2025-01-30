var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require('express-session');

var productRouter = require('./routes/product');
var homepageRoutes = require("./routes/homepage");
var checkoutRouter = require("./routes/checkout");
var adminRouter = require("./routes/admin");
var confirmRouter = require("./routes/confirmation");
//var indexRouter = require("./routes/index");

var app = express();

// view engine setup
app.set("views", [
  path.join(__dirname, "views"),
  path.join(__dirname, "views", "admin"),
]);
app.set("view engine", "ejs");

app.use(session({
  secret: 'supersecret',
}));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//app.use("/", indexRouter);
app.use("/", homepageRoutes);
app.use("/product", productRouter);
app.use("/admin", adminRouter);
app.use("/checkout", checkoutRouter);
app.use("/checkout/confirmation", confirmRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

