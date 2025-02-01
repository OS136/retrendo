// db.js - Create this new file in your project root
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'db', 'Retrendo.db'), sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to the database successfully");
  }
});

module.exports = db;