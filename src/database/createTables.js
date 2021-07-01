const db = require("./database.js");

// db.connect((err) => {
//   if (!err) {
//     console.log("createTable connected to database");
//   } else {
//     throw err;
//   }
// });

(async function () {
  console.log("blin");
  await db.promise().query(`CREATE TABLE IF NOT EXISTS user_types (
    type VARCHAR(30) UNIQUE NOT NULL,
    PRIMARY KEY(type)
  )`);
  await db.promise().query(`
  CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(60) NOT NULL,
    user_type VARCHAR(30) NOT NULL DEFAULT "normal",
    PRIMARY KEY (username),
    FOREIGN KEY (user_type) REFERENCES user_types(type)
  )
  `);
  await db.promise().query(`
  CREATE TABLE IF NOT EXISTS posts_news (
    id SMALLINT UNSIGNED UNIQUE NOT NULL AUTO_INCREMENT,
    author VARCHAR(30) NOT NULL,
    title TINYTEXT NOT NULL,
    content TEXT NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY (author) REFERENCES users(username)
  )
  `);
  await db.promise().query(`
  CREATE TABLE IF NOT EXISTS comments_news (
    id SMALLINT UNSIGNED UNIQUE NOT NULL AUTO_INCREMENT,
    username VARCHAR(30) NOT NULL,
    post_id SMALLINT UNSIGNED NOT NULL,
    comment TINYTEXT  NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (username) REFERENCES users(username),
    FOREIGN KEY (post_id) REFERENCES posts_news(id)
  )
  `);
  await db.promise().query(`
  INSERT IGNORE INTO user_types (type) VALUES("normal")
  `);
  await db.promise().query(`
  INSERT IGNORE INTO user_types (type) VALUES("admin")
  `);
})();
