const { dbConnection } = require("../database.js");

async function getAllUsers() {
  return dbConnection.promise().query("SELECT (username) FROM users");
}
async function getUser(username) {
  const result = await dbConnection
    .promise()
    .query("SELECT * FROM users WHERE BINARY username = ?", [username]);
  if (!(result && result[0])) {
    throw new Error("Error while trying to get user");
  }
  // returns the user or undefined
  return result[0][0];
}
async function createUser(username, passHash) {
  return dbConnection
    .promise()
    .query(
      "INSERT INTO users (username, password) VALUES(?,?)",
      [username, passHash],
      function (err, _) {
        if (err) throw new Error("Error while trying to insert user");
      }
    );
}
async function updateUser(storedUsername, passHash, newUsername = "") {
  return dbConnection.promise().query(
    `UPDATE users
    SET username = ?, password = ?
    WHERE username = ?`,
    [newUsername || storedUsername, passHash, storedUsername]
  );
}
async function deleteUser(username) {
  return dbConnection
    .promise()
    .query(
      `DELETE FROM users WHERE username = ?`,
      [username],
      function (err, _) {
        if (err) throw new Error("Error trying to delete user");
      }
    );
}

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
