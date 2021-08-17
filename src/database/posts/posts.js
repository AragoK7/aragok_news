const mysql = require("mysql2");

const { getDate } = require("../../helpers/functions");
const { dbConnection } = require("../database.js");

///////////////////////////////////////////////////////
async function getPost(id) {
  return dbConnection
    .promise()
    .query("SELECT * FROM `posts_news` WHERE `id` = ?", [id]);
}
async function createPost(username, title, content) {
  return dbConnection
    .promise()
    .query(
      "INSERT INTO posts_news (author, title, content, date) VALUES(?, ?, ?, ?)",
      [username, title, content, getDate()]
    );
}
async function updatePost(title, content, id) {
  return dbConnection.promise().query(
    `UPDATE posts_news
      SET title = ?, content = ?, date = ?
      WHERE id = ?
      `,
    [title, content, getDate(), id]
  );
}
async function deletePost(id) {
  return dbConnection
    .promise()
    .query("DELETE FROM posts_news WHERE id = ?", [id]);
}

async function get10LatestNews() {
  const result = await dbConnection
    .promise()
    .query("SELECT * FROM posts_news ORDER BY `date` DESC LIMIT 10 ");
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

module.exports = {
  getPost,
  createPost,
  updatePost,
  deletePost,
  get10LatestNews,
};
