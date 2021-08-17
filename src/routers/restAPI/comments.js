const express = require("express");
const router = express.Router();

const { redirectLogin } = require("../../authentication.js");
const { check, validationResult } = require("express-validator");
const {
  createComment,
  getCommentById,
  updateComment,
  deleteComment,
} = require("../../database/comments/comments.js");

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
  [check("comment").notEmpty(), check("postId").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    const { postId, comment } = req.body;
    const { username } = req.session;
    try {
      const result = await createComment(username, postId, comment);
      return res.redirect(`/news/${postId}`);
    } catch (err) {
      res.sendStatus(400);
    }
  }
);

router.put(
  "/:commentId",
  redirectLogin,
  [check("comment").notEmpty()],
  async function (req, res) {
    const { comment } = req.body;
    try {
      const getCommentByIdResult = await getCommentById(req.params.commentId);
      if (
        getCommentByIdResult &&
        getCommentByIdResult[0] &&
        getCommentByIdResult[0][0]
      ) {
        if (getCommentByIdResult[0][0].username !== req.session.username) {
          return res.sendStatus(401);
        }
        const result = await updateComment(comment, req.params.commentId);
        return res.sendStatus(200);
      }
      return res.sendStatus(404);
    } catch (err) {
      res.sendStatus(400);
    }
  }
);

router.delete("/:commentId", redirectLogin, async function (req, res) {
  try {
    const getCommentByIdResult = await getCommentById(req.params.commentId);
    if (
      getCommentByIdResult &&
      getCommentByIdResult[0] &&
      getCommentByIdResult[0][0]
    ) {
      if (
        getCommentByIdResult[0][0].username === req.session.username ||
        req.session.user_type === "admin"
      ) {
        const result = await deleteComment(req.params.commentId);
        return res.sendStatus(200);
      }
      return res.sendStatus(401);
    } else {
      return res.sendStatus(404);
    }
  } catch (err) {
    throw err;
  }
});

module.exports = router;
