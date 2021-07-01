const express = require("express");
const router = express.Router();

const {
  redirectHome,
  redirectLogin,
  redirectRestricted,
} = require("../authentication.js");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

// @route REGISTER:

// @method GET:
router.get("/", redirectHome, function (req, res) {
  return res.render("register");
});

//// @method POST: WITH NO DATABASE CONNECTION !!!
const { users } = require("../database/fakeDB.js");

router.post(
  "/",
  redirectHome,
  [
    check("username").notEmpty(),
    check("password").notEmpty(),
    check("confirmPassword").notEmpty(),
  ],
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.redirect("/register?error=true");
    }
    const { username, password, confirmPassword } = req.body;
    const existingUsername = users.find((user) => user.username === username);
    if (existingUsername)
      return res.redirect("/register?error=userAlreadyExists");
    if (password !== confirmPassword)
      return res.redirect("/register?error=passwordsNotMatching");
    try {
      const passHash = await bcrypt.hash(password, 10);
      let user_type = "normal";
      if (username === "goran1") user_type = "admin";
      users.push({
        username: username,
        password: passHash,
        user_type: user_type,
      });
      req.session.username = username;
      req.session.user_type = user_type;

      return res.status(201).redirect("/");
    } catch (err) {
      throw err;
    }
  }
);

//// @method POST: WITH MYSQL DATABASE CONNECTION !!!
// const db = require("../database/database.js");
// router.post(
//   "/",
//   redirectHome,
//   [
//     check("username").notEmpty(),
//     check("password").notEmpty(),
//     check("confirmPassword").notEmpty(),
//   ],
//   async function (req, res) {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const { username, password, confirmPassword } = req.body;
//     if (password !== confirmPassword) return res.redirect("/register?error=passwordsNotMatching");
//       try {
//         const passHash = await bcrypt.hash(password, 10);

//         // MYSQL DB REQUIRED
//         await db
//           .promise()
//           .query("INSERT INTO users (username, password) VALUES(?,?)", [
//             username,
//             passHash,
//           ]);
//         req.session.username = username;
//         req.session.user_type = "normal";

//         return res.status(201).redirect("/");
//       } catch (err) {
//         throw err;
//       }
//
//   }
// );
module.exports = router;
