const redirectLogin = (req, res, next) => {
  if (!req.session.username) {
    res.redirect("/login");
  } else {
    next();
  }
};

const redirectRestricted = (req, res, next) => {
  if (req.session.user_type !== "admin") {
    res.redirect("/");
  } else {
    next();
  }
};

const redirectHome = (req, res, next) => {
  if (req.session.username) {
    res.redirect("/");
  } else {
    next();
  }
};

module.exports = {
  redirectHome,
  redirectLogin,
  redirectRestricted,
};
