const express = require("express");
const router = express.Router();
const { getNPosts } = require("../database/posts/posts.js");
router.get("/", async function (req, res) {
  try {
    const result = await getNPosts(0);
    return res.render("index", {
      content: result,
      user: req.session.username,
      user_type: req.session.user_type,
    });
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
});

module.exports = router;
