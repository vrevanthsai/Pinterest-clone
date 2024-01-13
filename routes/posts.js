// posts model
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  imageText: {
    type: String,
    required: true,
  },
  // to add uploaded image path
  image:{ 
    type:String
  },
//   to add userID 
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"user"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    // type: Number,
    // default: 0,
    type: Array,
    default: [],//we will store uids of people who liked
  },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
