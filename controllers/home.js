const Post = require('../models/post');

exports.getHome = (req, res, next) => {
  Post.find()
    .then(posts => {
      res.render('shop/home', {
        pageTitle: 'Home Page',
        path: '/',
        posts,
        isAuth: req.session.isLoggedIn
      });
    })
    .catch(err => {
      console.log(err);
    });
};
exports.getDetail = (req, res, next) => {
  const { postId } = req.params;
  Post.findById(postId)
    .then(post => {
      res.render('shop/post-detail', {
        pageTitle: 'Detail Page',
        path: '/',
        post,
        isAuth: req.session.isLoggedIn
      });
    })
    .catch(err => {
      console.log(err);
    });
};
