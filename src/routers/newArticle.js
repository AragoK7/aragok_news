const express = require("express");
const router = express.Router();

const {
  redirectHome,
  redirectLogin,
  redirectRestricted,
} = require("../authentication.js");
const { check, validationResult } = require("express-validator");

// @route NEW ARTICLE
router.get("/", redirectLogin, redirectRestricted, (req, res) => {
  return res.render("newArticle", {
    user: req.session.username,
    user_type: req.session.user_type,
  });
});
//// @method POST: WITH NO DATABASE CONNECTION
const { posts_news } = require("../database/fakeDB.js");
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
      posts_news.push({
        id: posts_news.length + 1,
        author: username,
        title: title,
        content: content,
        date: Date(),
      });
      return res.redirect("/");
    } catch (err) {
      return res.send({ err: err });
    }
  }
);

//// @method POST: WITH MYSQL DATABASE CONNECTION !!!
// const db = require("../database/database.js");
// router.post(
//   "/",
//   redirectLogin,
//   [check("title").notEmpty(), check("content").notEmpty()],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).send({ errors: errors.array() });
//     }
//     const { username } = req.session;
//     const { title, content } = req.body;
//     try {
//       const result = await db
//         .promise()
//         .query(
//           "INSERT INTO posts_news (author, title, content) VALUES(?, ?, ?)",
//           [username, title, content]
//         );
//       return res.redirect("/");
//     } catch (err) {
//       return res.send({ err: err });
//     }
//   }
// );

module.exports = router;
