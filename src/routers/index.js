const express = require("express");
const router = express.Router();

//// @method POST: WITH NO MYSQL DATABASE CONNECTION !!!
const { users, posts_news } = require("../database/fakeDB.js");
router.get("/", function (req, res) {
  const sorted = posts_news.sort((a, b) => (a.date > b.date ? -1 : 1));
  return res.render("index", {
    content: sorted,
    user: req.session.username,
    user_type: req.session.user_type,
  });
});

//// @method POST: WITH MYSQL DATABASE CONNECTION !!!
// const db = require("../database/database.js");
// router.get("/", async function (req, res) {
//   const result = await db
//     .promise()
//     .query("SELECT * FROM posts_news ORDER BY `date` DESC LIMIT 10 ");
//   if (!result && !(result[0].length > 0)) {
//     return res.sendStatus(400);
//   }
//   const [content] = result;
//   return res.render("index", {
//     content: content,
//     user: req.session.username,
//     user_type: req.session.user_type,
//   });
// });

module.exports = router;
