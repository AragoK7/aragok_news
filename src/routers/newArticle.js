const express = require("express");
const router = express.Router();

const { redirectRestricted } = require("../authentication.js");

router.get("/", redirectRestricted, (req, res) => {
  return res.render("newArticle", {
    user: req.session.username,
    user_type: req.session.user_type,
  });
});

module.exports = router;
