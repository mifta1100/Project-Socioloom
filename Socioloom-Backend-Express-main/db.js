const mysql = require('mysql2');

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "K1llernet",
  database: "socioloom"
});

module.exports = db;
