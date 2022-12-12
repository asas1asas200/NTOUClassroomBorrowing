const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user.js");
module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(
    new LocalStrategy(function (id, password, done) {
      console.log(id + " ; " + password);
      User.findOne({ id: id })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: "Incorrect username." });
          }
          User.comparePassword(
            password,
            user.password,
            function (err, isMatch) {
              if (err) throw err;
              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, { message: "Invalid password" });
              }
            }
          );
        })
        .catch((err) => {
          done(err, false);
        });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
      done(err, user);
    });
  });
};
