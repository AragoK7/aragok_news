const express = require("express");
const session = require("express-session");

function makeApp(db) {
  const app = express();

  const path = require("path");
  const publicDirectoryPath = path.join(__dirname, "../public");
  const viewsPath = path.join(__dirname, "../views");

  app.use(express.static(publicDirectoryPath));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.set("views", viewsPath);
  app.set("view engine", "ejs");

  app.use(
    session({
      name: "session",
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
      cookie: {
        maxAge: Number(process.env.COOKIEMAXAGE),
        sameSite: true,
      },
    })
  );
  ///////////////////// ROUTERS //////////////////////
  const loginRouter = require("./routers/login.js");
  const registerRouter = require("./routers/register.js");
  const newsRouter = require("./routers/news.js");
  const newArticleRouter = require("./routers/newArticle.js");
  const logoutRouter = require("./routers/logout.js");
  const forumRouter = require("./routers/forum.js");
  const indexRouter = require("./routers/index.js");
  const usersRouter = require("./routers/restAPI/users.js");
  const settingsRouter = require("./routers/settings.js");
  const postsRouter = require("./routers/restAPI/posts.js");
  const commentsRouter = require("./routers/restAPI/comments.js");
  // USE ROUTERS //
  app.use("/login", loginRouter);
  app.use("/register", registerRouter);
  app.use("/news", newsRouter);
  app.use("/newArticle", newArticleRouter);
  app.use("/logout", logoutRouter);
  app.use("/forum", forumRouter);
  app.use("/settings", settingsRouter);
  // API
  app.use("/users", usersRouter);
  app.use("/posts", postsRouter);
  app.use("/comments", commentsRouter);
  app.use("/", indexRouter);

  return app;
}
module.exports = makeApp;
