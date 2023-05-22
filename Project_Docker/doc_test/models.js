// models.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const userDetailsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  topic: { type: String, required: true },
  description: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);
const UserDetails = mongoose.model('UserDetails', userDetailsSchema);

module.exports = { User, UserDetails };
