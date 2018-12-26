const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  favourit: {
    posts: [{ post: { type: Schema.Types.ObjectId, ref: 'Post', required: true } }]
  }
});

// eslint-disable-next-line func-names
userSchema.methods.addToFavourit = function(post) {
  const FavouritPostIndex = this.favourit.posts.findIndex(
    // eslint-disable-next-line no-underscore-dangle
    (cp) => cp.post.toString() === post._id.toString()
  );
  const updatedFavouritPosts = [...this.favourit.posts];

  if (FavouritPostIndex >= 0) {
    console.log('this wish is already fullfilled!!');
  } else {
    updatedFavouritPosts.push({
      // eslint-disable-next-line no-underscore-dangle
      post: post._id
    });
  }
  const updatedFavourit = {
    posts: updatedFavouritPosts
  };
  this.favourit = updatedFavourit;
  return this.save();
};

// eslint-disable-next-line func-names
userSchema.methods.removeFavourit = function(postId) {
  // eslint-disable-next-line arrow-body-style
  const updatedPost = this.favourit.posts.filter((Post) => {
    return Post.post.toString() !== postId.toString();
  });
  this.favourit.posts = updatedPost;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
