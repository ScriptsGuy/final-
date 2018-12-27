const Post = require('../models/post');

exports.getHome = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.render('shop/home', {
        pageTitle: 'Home Page',
        path: '/',
        posts,
        csrfToken: req.csrfToken()
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getDetail = (req, res, next) => {
  const { postId } = req.params;
  Post.findById(postId)
    .populate('userId')
    .then((post) => {
      console.log(post);
      res.render('shop/post-detail', {
        pageTitle: 'Detail Page',
        path: '/',
        post
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
