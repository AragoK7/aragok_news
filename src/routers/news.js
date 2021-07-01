const express = require("express");
const router = express.Router();

const { redirectLogin } = require("../authentication.js");
const db = require("../database/database.js");

/////////////////////////////////////////////////////////
// NO MYSQL DATABASE
const { posts_news, comments_news } = require("../database/fakeDB.js");
/////////////////////////////////////////////////////////
//// @method GET: WITH NO MYSQL DATABASE CONNECTION !!!
router.get("/:id", async function (req, res) {
  try {
    const param_id = Number(req.params.id);
    const post = posts_news.find((post) => post.id === param_id);

    if (!post) return res.sendStatus(404);
    console.log("ALL COMMENTS:", comments_news);
    const comments = comments_news.filter(
      (comment) => comment.post_id === param_id
    );
    console.log(comments);
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
///////////////////////////////////////////////////////////////
//// @method POST: WITH NO MYSQL DATABASE CONNECTION !!!
router.post("/:id", redirectLogin, async function (req, res) {
  console.log("we here");
  const { comment } = req.body;
  const { id } = req.params;
  const { username } = req.session;
  console.log(username, id, comment);
  try {
    comments_news.push({
      id: comments_news.length + 1,
      username: username,
      post_id: Number(id),
      comment: comment,
      date: Date(),
    });
    return res.redirect("/");
  } catch (err) {
    return res.json({ err });
  }
});
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
//  WITH MYSQL DATABASE
/////////////////////////////////////////////////////////
//// @method GET: WITH MYSQL DATABASE CONNECTION !!!
// router.get("/:id", async function (req, res) {
//   try {
//     const result = await db
//       .promise()
//       .query("SELECT * FROM `posts_news` WHERE `id` = ?", [req.params.id]);
//     if (!result && !(result[0].length > 0)) {
//       return res.sendStatus(404);
//     }
//     const [[post]] = result;
//     const result2 = await db
//       .promise()
//       .query("SELECT * FROM `comments_news` WHERE `post_id` = ? LIMIT 2", [
//         req.params.id,
//       ]);
//     if (!result2) {
//       return res.sendStatus(400);
//     }
//     const [comments] = result2;
//     return res.render("news", {
//       post: post,
//       comments: comments,
//       user: req.session.username,
//       user_type: req.session.user_type,
//     });
//   } catch (err) {
//     return res.json({ err });
//   }
// });

/////////////////////////////////////////////////////////
//// @method POST: WITH MYSQL DATABASE CONNECTION !!!
// router.post("/:id", redirectLogin, async function (req, res) {
//   console.log("we here");
//   const { comment } = req.body;
//   const { id } = req.params;
//   const { username } = req.session;
//   console.log(username, id, comment);
//   try {
//     const result = await db
//       .promise()
//       .query(
//         "INSERT INTO comments_news (username, post_id, comment) VALUES(?, ?, ?)",
//         [username, id, comment]
//       );
//     console.log(result);
//     return res.redirect("/");
//   } catch (err) {
//     return res.json({ err });
//   }
// });

module.exports = router;
