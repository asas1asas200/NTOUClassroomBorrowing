const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
	password: { type: String, required: true, trim: true, minlength: 3 },
	email: { type: String, required: true, unique: true, trim: true, minlength: 3 },
	admin: { type: Boolean, required: true },
	id: { type: String, required: true, unique: true, trim: true, minlength: 3 },
	phone: { type: String, required: true, unique: true, trim: true, minlength: 3 },
	confirmed: { type: Boolean, required: true }
});

module.exports = mongoose.model('User', UserSchema);