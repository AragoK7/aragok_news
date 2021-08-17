const express = require("express");
const router = express.Router();

const { redirectHome, redirectLogin } = require("../../authentication.js");
const { check, validationResult } = require("express-validator");
const {
  getUser,
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
} = require("../../database/users/users.js");
const bcrypt = require("bcryptjs");

router.get("/:username", async (req, res) => {
  const result = await getUser(req.params.username);
  if (result && result[0] && result[0][0]) {
    return res.send(result[0][0]);
  }
  res.redirect("/users");
});

router.get("/", async (req, res) => {
  const result = await getAllUsers();
  if (result && result[0]) {
    return res.send(result[0]);
  }
  return res.send({ error: "No users exist" });
});

router.post(
  "/",
  redirectHome,
  [
    check("username").notEmpty(),
    check("password").notEmpty(),
    check("confirmPassword").notEmpty(),
  ],
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password, confirmPassword } = req.body;
    try {
      if (password !== confirmPassword)
        return res.redirect("/register?error=passwordsNotMatching");
      const existingUser = await getUser(username);
      if (existingUser)
        return res.redirect("/register?error=userAlreadyExists");

      const passHash = await bcrypt.hash(password, 10);

      // MYSQL DB REQUIRED
      await createUser(username, passHash);
      req.session.username = username;
      req.session.user_type = "normal";

      return res.status(201).redirect("/");
    } catch (err) {
      throw err;
    }
  }
);

router.put(
  "/",
  redirectLogin,
  [
    check("newUsername").notEmpty(),
    check("currentPassword").notEmpty(),
    check("newPassword").notEmpty(),
    check("confirmNewPassword").notEmpty(),
  ],
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { newUsername, currentPassword, newPassword, confirmNewPassword } =
      req.body;

    if (newPassword !== confirmNewPassword)
      return res.redirect("/register?error=passwordsNotMatching");
    try {
      const result = await getUser(req.session.username);
      if (bcrypt.compareSync(currentPassword, result.password)) {
        const passHash = await bcrypt.hash(newPassword, 10);
        await updateUser(req.session.username, passHash, newUsername);
        req.session.destroy((err) => {
          if (err) {
            return res.redirect("/?success=false");
          }
          return res.sendStatus(200);
        });
      } else {
        return res.redirect("/settings?error=wrongPassword");
      }
    } catch (err) {
      throw err;
    }
  }
);

router.delete(
  "/",
  redirectLogin,
  [check("password").notEmpty()],
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { password } = req.body;
    try {
      const result = await getUser(req.session.username);
      if (!result) throw new Error("Could not find the user to be deleted");
      const storedPassword = result.password;
      if (bcrypt.compareSync(password, storedPassword)) {
        await deleteUser(req.session.username);
        req.session.destroy((err) => {
          if (err) {
            return res.redirect("/");
          }
        });
        return res.sendStatus(200);
      }
    } catch (err) {
      return res.json(err);
    }
  }
);

module.exports = router;