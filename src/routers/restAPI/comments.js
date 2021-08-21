const express = require("express");
const router = express.Router();

const { redirectLogin } = require("../../authentication.js");
const { check, validationResult } = require("express-validator");
const {
  getNPostComments,
  createComment,
  getCommentById,
  updateComment,
  deleteComment,
} = require("../../database/comments/comments.js");

router.get("/:postId/:page", async (req, res) => {
  const page = Number(req.params.page);
  const result = await getNPostComments(req.params.postId, page);
  if (result && result[0]) {
    return res.send(result[0]);
  }
  return res.send({ error: "No posts found" });
});

router.get("/:postId", async (req, res) => {
  const result = await getNPostComments(req.params.postId, 0);
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
    if (comment.length > 255)
      return res.status(400).json({
        message: `Your message is too long. Maximum of 255 characters allowed(Your comment had ${comment.length} characters)`,
      });
    const { username } = req.session;
    try {
      await createComment(username, postId, comment);
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
    if (comment.length > 255)
      return res.status(400).json({
        message: `Your message is too long. Maximum of 255 characters allowed(Your comment had ${comment.length} characters)`,
      });
    try {
      const getCommentByIdResult = await getCommentById(req.params.commentId);
      if (getCommentByIdResult) {
        if (getCommentByIdResult.username !== req.session.username) {
          return res.status(401).json({ message: "Unauthorized action" });
        }
        await updateComment(comment, req.params.commentId);
        return res.sendStatus(200);
      }
      return res.status(404).json({ message: "Could not find your comment" });
    } catch (err) {
      return res.json(err);
    }
  }
);

router.delete("/:commentId", redirectLogin, async function (req, res) {
  try {
    const getCommentByIdResult = await getCommentById(req.params.commentId);
    if (getCommentByIdResult) {
      if (
        getCommentByIdResult.username === req.session.username ||
        req.session.user_type === "admin"
      ) {
        const result = await deleteComment(req.params.commentId);
        return res.sendStatus(200);
      }
      return res.status(401).json("Unauthorized action");
    } else {
      return res.status(404).json({ message: "Could not find your comment" });
    }
  } catch (err) {
    return res.json(err);
  }
});

module.exports = router;
