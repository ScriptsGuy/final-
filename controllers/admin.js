/* eslint-disable no-param-reassign */
const colors = require('colors');
const Post = require('../models/post');

exports.getAddPost = (req, res, next) => {
  res.render('admin/add-post', {
    pageTitle: 'Home Page',
    path: '/admin/add-post',
    edit: false,
    isAuth: req.session.isLoggedIn
  });
};

// eslint-disable-next-line consistent-return
exports.getEditPost = (req, res, next) => {
  const { edit } = req.query;
  if (!edit) {
    return res.redirect('/');
  }
  const { postId } = req.params;
  Post.findById(postId)
    .then((post) => {
      res.render('admin/add-post', {
        pageTitle: 'edit post',
        path: '/admin/edit-post',
        edit,
        post,
        isAuth: req.session.isLoggedIn
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditPost = (req, res, next) => {
  const { postId } = req.body;
  const { title } = req.body;
  const { category } = req.body;
  const { brand } = req.body;
  const { Condition } = req.body;
  const { image } = req.body;
  const { price } = req.body;
  const { priceState } = req.body;
  const { city } = req.body;
  const { phone } = req.body;
  const { email } = req.body;
  const { description } = req.body;
  Post.findById(postId)
    .then((post) => {
      post.title = title;
      post.category = category;
      post.brand = brand;
      post.Condition = Condition;
      post.image = image;
      post.price = price;
      post.priceState = priceState;
      post.city = city;
      post.phone = phone;
      post.email = email;
      post.description = description;
      return post.save();
    })
    .then((result) => {
      console.log('Upadted Post!!'.bgCyan.black);
      res.redirect('/admin/posts');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postAddPost = (req, res, next) => {
  const { title } = req.body;
  const { category } = req.body;
  const { brand } = req.body;
  const { Condition } = req.body;
  const { image } = req.body;
  const { price } = req.body;
  const { priceState } = req.body;
  const { city } = req.body;
  const { phone } = req.body;
  const { email } = req.body;
  const { description } = req.body;
  const currentDate = new Date();
  const date = `${currentDate.getDate()}/${currentDate.getMonth()}/${currentDate.getFullYear()}`;
  const post = new Post({
    title,
    category,
    brand,
    Condition,
    image,
    price,
    priceState,
    city,
    phone,
    email,
    description,
    date,
    userId: req.user
  });
  post
    .save()
    .then((result) => {
      console.log(result);
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.render('admin/posts', {
        pageTitle: 'My Posts',
        path: '/admin/posts',
        posts,
        isAuth: req.session.isLoggedIn
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getFavourit = (req, res, next) => {
  req.user
    .populate('favourit.posts.post')
    .execPopulate()
    .then((user) => {
      const { posts } = user.favourit;
      console.log(posts);
      res.render('admin/favourit', {
        pageTitle: 'favourits',
        path: '/admin/favourit',
        posts,
        isAuth: req.session.isLoggedIn
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postFavourit = (req, res, next) => {
  const { postId } = req.body;
  Post.findById(postId)
    .then((post) => req.user.addToFavourit(post))
    .then((result) => {
      console.log('favourit has been added xD');
      res.redirect('/admin/favourit');
    });
};

exports.postDeletePost = (req, res, next) => {
  const { postId } = req.body;
  Post.findByIdAndRemove(postId)
    .then(() => {
      console.log('Removed Post!!'.bgRed.white);
      req.user
        .removeFavourit(postId)
        .then((result) => {
          console.log('removed from wishlist'.red);
        })
        .catch((err) => {
          console.log(err);
        });
      res.redirect('/admin/posts');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteFavourit = (req, res, next) => {
  const { postId } = req.body;
  req.user
    .removeFavourit(postId)
    .then((result) => {
      res.redirect('/admin/favourit');
    })
    .catch((err) => {
      console.log(err);
    });
};
