const express = require("express");
const router = express.Router();

const {
  redirectLogin,
  redirectRestricted,
} = require("../../authentication.js");
const { check, validationResult } = require("express-validator");
const {
  createPost,
  deletePost,
  updatePost,
  getNPosts,
} = require("../../database/posts/posts.js");

router.get("/:postId", async (req, res) => {
  const result = await getAllPosts();
  if (result && result[0]) {
    return res.send(result[0]);
  }
  return res.send({ error: "No posts found" });
});

router.get("/", async (req, res) => {
  const result = await getAllPosts();
  if (result && result[0]) {
    return res.send(result[0]);
  }
  return res.send({ error: "No posts found" });
});

router.get("/getMoreNews/:page", async (req, res) => {
  try {
    const result = await getNPosts(Number(req.params.page));
    if (!result) throw new Error("No more news");
    return res.json(result);
  } catch (err) {
    return res.json(err.message);
  }
});

router.post(
  "/",
  redirectLogin,
  [check("title").notEmpty(), check("content").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    const { username } = req.session;
    const { title, content } = req.body;
    try {
      const result = await createPost(username, title, content);

      return res.redirect("/");
    } catch (err) {
      return res.send({ err: err });
    }
  }
);

router.put(
  "/:postId",
  redirectLogin,
  [check("newTitle").notEmpty(), check("newContent").notEmpty()],
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { newTitle, newContent } = req.body;
    try {
      const result = await updatePost(newTitle, newContent, req.params.postId);
      return res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.delete("/:id", redirectRestricted, async function (req, res) {
  try {
    const result = await deletePost(req.params.id);
    if (result !== true)
      res.status(400).json({ message: "Could not delete post" });
    return res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
