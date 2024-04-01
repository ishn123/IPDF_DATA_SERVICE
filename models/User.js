const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define schema for Users collection
const UserSchema = new Schema({
  image: String,
  name: String,
  email: String,
  password: String,
  bio: String,
  occupation: String
});






module.exports = mongoose.model("User",UserSchema);
