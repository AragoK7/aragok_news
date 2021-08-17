const express = require("express");
const router = express.Router();

const { get10LatestNews } = require("../database/posts/posts.js");
router.get("/", async function (req, res) {
  try {
    const result = await get10LatestNews();
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
