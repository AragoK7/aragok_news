const express = require("express");
const router = express.Router();

const { getPost } = require("../database/posts/posts.js");
const { getNPostComments } = require("../database/comments/comments.js");

router.get("/:id", async function (req, res) {
  try {
    const result = await getPost(req.params.id);
    if (!result && !(result[0].length > 0)) {
      return res.sendStatus(404);
    }
    const [[post]] = result;
    const comments = await getNPostComments(req.params.id, 0);

    if (!comments) {
      return res.json(400);
    }
    return res.render("news", {
      post: post,
      comments: comments,
      user: req.session.username,
      user_type: req.session.user_type,
    });
  } catch (err) {
    return res.json({ err });
  }
});

module.exports = router;
