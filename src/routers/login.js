const express = require("express");
const router = express.Router();

const {
  redirectHome,
  redirectLogin,
  redirectRestricted,
} = require("../authentication.js");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

// @route LOGIN:

// @method GET:
router.get("/", redirectHome, function (req, res) {
  return res.render("login");
});
//////////////////////////////////////////////////////////////
//// @method POST: WITH NO DATABASE CONNECTION
const { users } = require("../database/fakeDB.js");
router.post(
  "/",
  redirectHome,
  [check("username").notEmpty(), check("password").notEmpty()],
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.redirect("/login?error=true");
    }
    const { username, password } = req.body;
    try {
      const result = users.find((user) => user.username === username);
      if (!result) return res.redirect("/login?error=userDoesNotExist");
      const hashedPassword = result.password;
      if (bcrypt.compareSync(password, hashedPassword)) {
        req.session.username = username;
        req.session.user_type = result["user_type"];
        return res.redirect("/");
      } else {
        return res.redirect("/login?error=wrongPassword");
      }
    } catch (err) {
      throw err;
    }
  }
);
///////////////////////////////////////////////////////
//// @method POST: WITH MYSQL DATABASE CONNECTION
// const db = require("../database/database.js");
// router.post(
//   "/",
//   redirectHome,
//   [check("username").notEmpty(), check("password").notEmpty()],
//   async function (req, res) {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).send({ errors: errors.array() });
//     }
//     const { username, password } = req.body;
//     try {
//       const result = await db
//         .promise()
//         .query("SELECT * FROM users WHERE BINARY username = ?", username);

//       const hashedPassword = result[0][0]?.password;
//       if (bcrypt.compareSync(password, hashedPassword)) {
//         req.session.username = username;
//         req.session.user_type = result[0][0]["user_type"];
//         return res.redirect("/");
//       } else {
//         return res.json({ error: "Password not matching" });
//       }
//     } catch (err) {
//       throw err;
//     }
//   }
// );

module.exports = router;
