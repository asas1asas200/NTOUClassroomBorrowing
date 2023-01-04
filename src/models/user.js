const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  password: { type: String, required: true, trim: true, minlength: 3 },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  admin: { type: Boolean, required: true },
  id: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  emailVerified: { type: Boolean, required: true },
  verified: { type: Boolean, required: true },
});

userSchema.pre("save", function (next) {
  var user = this;
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);
    //加密
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      console.log(user.password);
      next();
    });
  });
});

userSchema.methods.comparePassword = function (
  candidatePassword,
  hash,
  callback
) {
  bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
};

userSchema.static("createRoot", async function () {
  let root = await this.findOne({ id: "root" });
  if (!root) {
    const user = new this({
      username: "root",
      password: "root",
      email: "root@root",
      admin: true,
      id: "root",
      phone: "0000000000",
      emailVerified: true,
      verified: true,
    });
    await user.save();
    console.log("Root account created automatically.");
  } else {
    console.log("Root account already existed.");
  }
});

module.exports = mongoose.model("User", userSchema);
