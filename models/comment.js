const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema({
  comment: String,
  date: String,
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Comment', commentSchema);
