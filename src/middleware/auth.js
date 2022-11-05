module.exports = {
  loginedUser: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/users/login");
  },
  admin: (req, res, next) => {
    if (req.isAuthenticated() && req.user.admin) {
      return next();
    }
    res.status(403).send("<h1> 403 Forbidden </h1>");
  },
};