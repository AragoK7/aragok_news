const { getDate } = require("../../helpers/functions");
const { dbConnection } = require("../database.js");

///////////////////////////////////////////////////////
async function getAllPostComments(postId) {
  return dbConnection
    .promise()
    .query("SELECT * FROM comments_news WHERE post_id = ?", [postId]);
}
async function getCommentById(commentId) {
  return dbConnection
    .promise()
    .query("SELECT * FROM comments_news WHERE id = ? ", [commentId]);
}
async function createComment(username, commentId, comment) {
  return dbConnection
    .promise()
    .query(
      "INSERT INTO comments_news (username, post_id, comment, date) VALUES(?, ?, ?, ?)",
      [username, commentId, comment, getDate()]
    );
}
async function updateComment(comment, commentId) {
  return dbConnection.promise().query(
    `UPDATE comments_news
  SET comment = ?, date = ?
  WHERE id = ?`,
    [comment, getDate(), commentId]
  );
}
async function deleteComment(commentId) {
  return dbConnection
    .promise()
    .query("DELETE FROM comments_news WHERE id = ?", [commentId]);
}

module.exports = {
  getAllPostComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};
