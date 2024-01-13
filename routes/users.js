// user model
const mongoose = require('mongoose');
// include plm
const plm=require("passport-local-mongoose");
// include mongoose.connect()
mongoose.connect("mongodb://127.0.0.1:27017/pinterest-clone");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // required: true,
  },
  // to add postID use this formate
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  dp: {
    type: String, // Assuming you store the profile picture as a URL or file path
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
});
// include plugin
userSchema.plugin(plm)

// create the user model
module.exports = mongoose.model("user", userSchema);