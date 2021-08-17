const express = require("express");
const router = express.Router();

const { redirectHome } = require("../authentication.js");

router.get("/", redirectHome, function (req, res) {
  return res.render("register");
});

module.exports = router;
