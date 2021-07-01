require("dotenv").config();

const express = require("express");
const session = require("express-session");
// const db = require("./database/database.js");

const {
  users,
  posts_news,
  user_types,
  comments_news,
} = require("./database/fakeDB.js");

const port = process.env.PORT || 3000;
const app = express();

const cookieParser = require("cookie-parser");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const {
  redirectHome,
  redirectLogin,
  redirectRestricted,
} = require("./authentication.js");

///////////////////// ROUTERS //////////////////////
const loginRouter = require("./routers/login.js");
const registerRouter = require("./routers/register.js");
const newsRouter = require("./routers/news.js");
const newArticleRouter = require("./routers/newArticle.js");
const logoutRouter = require("./routers/logout.js");
const forumRouter = require("./routers/forum.js");
const indexRouter = require("./routers/index.js");

app.use((req, _res, next) => {
  console.log(req.method, req.path);
  next();
});

const path = require("path");
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../views");

app.use(express.static(publicDirectoryPath));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(passport.initialize());
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
// USE ROUTERS //
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/news", newsRouter);
app.use("/newArticle", newArticleRouter);
app.use("/logout", logoutRouter);
app.use("/forum", forumRouter);
app.use("/", indexRouter);

// Requires MYSQL database connection
// db.connect((err) => {
//   if (!err) {
//     console.log("successfully connected to database");
//   } else {
//     throw err;
//   }
// });
// require("./database/createTables.js");

app.listen(port, () => `aragokNews is listening at port ${port}`);
