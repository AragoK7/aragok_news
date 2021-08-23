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

const regex = /^[a-zA-Z0-9-_]*$/;

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
      if (
        password.length < 5 ||
        username.length < 5 ||
        password.length > 30 ||
        username.length > 30
      ) {
        return res.status(400).json({
          message:
            "Username and password must contain beetween 5 and 30 characters characters",
        });
      }
      if (!(regex.test(username) && regex.test(password))) {
        return res.status(400).json({
          message:
            "Username and password must only contain dashes,underscores, letters and numbers",
        });
      }
      if (password !== confirmPassword)
        return res.status(400).json({ message: "Password not matching" });
      const existingUser = await getUser(username);
      if (existingUser)
        return res.status(400).json({ message: "Username already exists" });

      const passHash = await bcrypt.hash(password, 10);

      // MYSQL DB REQUIRED
      await createUser(username, passHash);
      req.session.username = username;
      req.session.user_type = "normal";

      return res.sendStatus(200);
    } catch (err) {
      return res.json(err);
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

    try {
      if (
        newPassword.length < 5 ||
        newUsername.length < 5 ||
        newPassword.length > 30 ||
        newUsername.length > 30
      ) {
        return res.status(400).json({
          message:
            "Username and password must contain beetween 5 and 30 characters characters",
        });
      }
      if (!(regex.test(newUsername) && regex.test(newPassword))) {
        return res.status(400).json({
          message:
            "Username and password must only contain dashes,underscores, letters and numbers",
        });
      }
      if (newUsername !== req.session.username) {
        const existingUser = await getUser(newUsername);
        if (existingUser)
          return res.status(400).json({ message: "Username already taken" });
      }
      if (newPassword !== confirmNewPassword)
        return res.status(400).json({ message: "Passwords not matching" });
      const user = await getUser(req.session.username);
      if (bcrypt.compareSync(currentPassword, user.password)) {
        const passHash = await bcrypt.hash(newPassword, 10);
        await updateUser(req.session.username, passHash, newUsername);
        req.session.destroy((err) => {
          if (err) {
            throw new Error("Could not destroy session");
          }
          // All good
          return res.sendStatus(200);
        });
      } else {
        return res.status(400).json({ message: "Incorrect Password" });
      }
    } catch (err) {
      return res.json(err);
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
            throw err;
          }
        });
        return res.sendStatus(200);
      }
      return res.status(400).json({ message: "Incorrect Password" });
    } catch (err) {
      return res.json(err);
    }
  }
);

module.exports = router;
