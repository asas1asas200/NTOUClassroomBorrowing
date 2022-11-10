module.exports = {
  loginedUser: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/users/session");
  },
  admin: (req, res, next) => {
    if (req.isAuthenticated() && req.user.admin) {
      return next();
    }
    res.status(403).send("<h1> 403 Forbidden </h1>");
  },
  unloginedUser: (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/home");
  },
};
