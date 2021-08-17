const db = require("./database/database.js");
const makeApp = require("./app.js");

db.dbConnection.connect((err) => {
  if (!err) {
    console.log("Successfully connected to database");
  } else {
    throw err;
  }
});

const app = makeApp(db);

const port = process.env.PORT || 3000;

app.listen(port, () => `aragokNews is listening at port ${port}`);
