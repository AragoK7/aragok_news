const express = require("express");
const router = express.Router();

const { redirectLogin, redirectRestricted } = require("../authentication.js");

router.get("/", redirectLogin, redirectRestricted, (req, res) => {
  return res.render("newArticle", {
    user: req.session.username,
    user_type: req.session.user_type,
  });
});

module.exports = router;
