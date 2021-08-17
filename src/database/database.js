const mysql = require("mysql2");
const host = process.env.DB_HOST || "localhost";
const port = process.env.DB_PORT || 3306;
const user = process.env.DB_USER || "root";
const password = process.env.DB_PASSWORD;
const dbName = process.env.DB_DATABASE;

console.log("LOGINFO:", host, port, user, password, dbName);

const dbConnection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

module.exports = {
  dbConnection,
};
