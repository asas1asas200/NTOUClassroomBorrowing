const mongoose = require("mongoose");

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
