const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/isAuth');

// start with /admin its filtered
router.get('/add-post', isAuth, adminController.getAddPost);
router.get('/posts', isAuth, adminController.getPosts);
router.get('/favourit', isAuth, adminController.getFavourit);
router.get('/edit-post/:postId', isAuth, adminController.getEditPost);
router.post('/add-post', isAuth, adminController.postAddPost);
router.post('/edit-post', isAuth, adminController.postEditPost);
router.post('/delete-post', isAuth, adminController.postDeletePost);
router.post('/favourit', isAuth, adminController.postFavourit);
router.post('/delete-favourit', isAuth, adminController.deleteFavourit);

module.exports = router;
