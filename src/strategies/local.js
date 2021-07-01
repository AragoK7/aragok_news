const LocalStrategy = require("passport-local");
const passport = require("passport");
const db = require("../database/database.js");

passport.serializeUser((user, done) => {
  done(null, user.username);
});
passport.deserializeUser(async (username, done) => {
  const result = await db
    .promise()
    .query("SELECT * FROM users WHERE username = ?", [username]);
});
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const result = await db
        .promise()
        .query("SELECT * FROM users WHERE username = ?", username);
      if (result[0].length === 0) {
        done(null, false);
      } else {
        if (result[0][0]["password"] === password) {
          done(null, result[0]);
        } else {
          done(null, false);
        }
      }
    } catch (err) {
      done(err, false);
    }
  })
);
