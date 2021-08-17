const db = require("./database/database.js");
const makeApp = require("./app.js");

console.log("BEFORE CONNECTING TO DB", db, db.connection, makeApp);

db.dbConnection.connect((err) => {
  if (!err) {
    console.log("Successfully connected to database");
  } else {
    throw err;
  }
});

console.log("AFTER CONNECTING TO DB");
console.log("BEFORE makeApp");
const app = makeApp(db);
console.log("AFTER makeApp");
const port = process.env.PORT || 3000;

app.listen(port, () => `aragokNews is listening at port ${port}`);
