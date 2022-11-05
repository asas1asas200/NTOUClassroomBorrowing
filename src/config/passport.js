const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user.js");
module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(
    new LocalStrategy({ usernameField: "id" }, (id, password, done) => {
      User.findOne({ id })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: "Incorrect username." });
          }
          if (user.password !== password) {
            return done(null, false, { message: "Incorrect password." });
          }
          return done(null, user);
        })
        .catch((err) => {
          done(err, false);
        });
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findOne({ id })
      .then((user) => done(null, user))
      .catch((err) => done(err, null));
  });
};
