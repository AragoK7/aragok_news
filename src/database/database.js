const mysql = require("mysql2");
const password = process.env.DB_PASSWORD;

// DB4FREE Credentiants
const host = "db4free.net";
const port = 3306;
const username = "aragok";
const pw = "aragokpassword";
const dbName = "aragok_news";

module.exports = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: password,
  database: "aragok_news",
});

// module.exports = mysql.createConnection({
//   host: host,
//   port: port,
//   user: username,
//   password: pw,
//   database: dbName,
// });
