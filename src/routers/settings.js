const express = require("express");
const router = express.Router();

const { redirectLogin } = require("../authentication.js");

router.get("/", redirectLogin, function (req, res) {
  return res.render("settings", {
    user: req.session.username,
    user_type: req.session.user_type,
  });
});

module.exports = router;
