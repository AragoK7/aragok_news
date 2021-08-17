const express = require("express");
const router = express.Router();

const { redirectLogin } = require("../../authentication.js");
const { check, validationResult } = require("express-validator");
const {
  createPost,
  deletePost,
  updatePost,
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
      res.sendStatus(200);
    } catch (err) {
      throw err;
    }
  }
);

router.delete("/:id", redirectLogin, async function (req, res) {
  try {
    const result = await deletePost(req.params.id);
    return res.sendStatus(200);
  } catch (err) {
    throw err;
  }
});

module.exports = router;
