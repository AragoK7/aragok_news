const mysql = require("mysql2");

const { getDate } = require("../../helpers/functions");
const { dbConnection } = require("../database.js");
const newsPerLoad = Number(process.env.NEWS_PER_LOAD);

///////////////////////////////////////////////////////
async function getPost(id) {
  return dbConnection
    .promise()
    .query("SELECT * FROM `posts_news` WHERE `id` = ?", [id]);
}
async function getNPosts(page = 0) {
  const lowerLimit = page * newsPerLoad;
  const result = await dbConnection
    .promise()
    .query("SELECT * FROM posts_news ORDER BY `date` DESC LIMIT ?,? ", [
      lowerLimit,
      newsPerLoad,
    ]);
  if (!(result && result[0])) {
    // Returns an array of null
    throw new Error("Error trying to get news");
  }
  // undefined means there are no news
  if (!(result[0].length > 0)) {
    return undefined;
  }
  // returns an array of news
  return result[0];
}
async function createPost(username, title, content) {
  return dbConnection
    .promise()
    .query("INSERT INTO posts_news (author, title, content) VALUES(?, ?, ?)", [
      username,
      title,
      content,
    ]);
}
async function updatePost(title, content, id) {
  return dbConnection.promise().query(
    `UPDATE posts_news
      SET title = ?, content = ?
      WHERE id = ?
      `,
    [title, content, id]
  );
}
async function deletePost(id) {
  const result = await dbConnection
    .promise()
    .query("DELETE FROM posts_news WHERE id = ?", [id], function (err, smth) {
      console.log(err);
      if (err) throw new Error("Error while trying to delete post");
    });
  if (result[0]?.affectedRows === 1) return true;
  return false;
}

module.exports = {
  getPost,
  createPost,
  updatePost,
  deletePost,
  getNPosts,
};
