const { getDate } = require("../../helpers/functions");
const { dbConnection } = require("../database.js");
const commentsPerPost = Number(process.env.COMMENTS_PER_POST);

///////////////////////////////////////////////////////
async function getAllPostComments(postId) {
  return dbConnection
    .promise()
    .query("SELECT * FROM comments_news WHERE post_id = ?", [postId]);
}
async function getNPostComments(postId, page = 0) {
  const lowerLimit = page * commentsPerPost;
  const result = await dbConnection
    .promise()
    .query(
      "SELECT * FROM comments_news WHERE post_id = ? ORDER BY `date` DESC LIMIT ?, ?",
      [postId, lowerLimit, commentsPerPost]
    );
  if (!result) {
    // Returns an array of null
    throw new Error("Error trying to get news");
  }
  // returns an array of news
  return result[0];
}

async function getCommentById(commentId) {
  const result = await dbConnection
    .promise()
    .query("SELECT * FROM comments_news WHERE id = ? ", [commentId]);
  if (!(result && result[0])) {
    throw new Error("Error trying to get news");
  }
  return result[0][0];
}
async function createComment(username, commentId, comment) {
  return dbConnection
    .promise()
    .query(
      "INSERT INTO comments_news (username, post_id, comment) VALUES(?, ?, ?)",
      [username, commentId, comment]
    );
}
async function updateComment(comment, commentId) {
  return dbConnection.promise().query(
    `UPDATE comments_news
    SET comment = ?
    WHERE id = ?`,
    [comment, commentId]
  );
}
async function deleteComment(commentId) {
  return dbConnection
    .promise()
    .query("DELETE FROM comments_news WHERE id = ?", [commentId]);
}

module.exports = {
  getAllPostComments,
  getNPostComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};
