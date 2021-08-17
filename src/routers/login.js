const express = require("express");
const router = express.Router();

const { redirectHome } = require("../authentication.js");

const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

router.get("/", redirectHome, function (req, res) {
  return res.render("login");
});
const { getUser } = require("../database/users/users.js");
router.post(
  "/",
  redirectHome,
  [check("username").notEmpty(), check("password").notEmpty()],
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    const { username, password } = req.body;
    try {
      const result = await getUser(username);
      if (result != undefined) {
        const hashedPassword = result.password;
        if (bcrypt.compareSync(password, hashedPassword)) {
          req.session.username = username;
          req.session.user_type = result["user_type"];
          return res.redirect("/?logIn=success");
        } else {
          return res.redirect("/login?error=wrongPassword");
        }
      } else {
        return res.redirect("/login?error=userDoesNotExist");
      }
    } catch (err) {
      res.json(err);
    }
  }
);

module.exports = router;
