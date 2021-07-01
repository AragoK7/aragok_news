const express = require("express");
const router = express.Router();

const { redirectLogin } = require("../authentication.js");

router.get("/", redirectLogin, (req, res) => {
  return res.render("forum", {
    user: req.session.username,
    user_type: req.session.user_type,
  });
});

module.exports = router;
