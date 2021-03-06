const express = require("express");
const router = express.Router();

const { redirectLogin } = require("../authentication.js");

router.get("/", redirectLogin, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/");
    }
  });
  res.redirect("/");
});

module.exports = router;
