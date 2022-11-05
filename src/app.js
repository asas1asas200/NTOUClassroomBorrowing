var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

var usePassport = require("./config/passport");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var homeRouter = require("./routes/home");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "secretString", // TODO: may change to env variable
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));

usePassport(app); // auth

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/home", homeRouter);

// db connection
// use local docker container for development
// TODO: Use winston instead of `console.log`
const uri = "mongodb://localhost:27017/NTOUClassroomBorrowingSystem";
mongoose
  .connect(uri)
  .then(() =>
    console.log("MongoDB database connection established successfully")
  );

var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// TODO: Need a better implementation.
function createRoot() {
  let root = db.collection("users").findOne({ id: "root" });
  root.then(async (result) => {
    if (!result) {
      const User = require("./models/user");
      const user = new User({
        username: "root",
        password: "root",
        email: "root@root",
        admin: true,
        id: "root",
        phone: "0000000000",
        confirmed: true,
      });
      await user.save();
      console.log("Root account create automatically.");
    } else {
      console.log("Root account already exist.");
    }
  });
}
createRoot();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
