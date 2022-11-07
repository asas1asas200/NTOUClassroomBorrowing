const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
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
  confirmed: { type: Boolean, required: true },
});

// TODO: Need a better implementation.
function createRoot(db) {
  let root = db.collection("users").findOne({ id: "root" });
  root.then(async (result) => {
    if (!result) {
      const User = mongoose.model("User", UserSchema);
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

module.exports = mongoose.model("User", UserSchema);
module.exports.createRoot = createRoot;
