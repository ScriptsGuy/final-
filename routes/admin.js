const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');

// start with /admin its filtered
router.get('/add-post', adminController.getAddPost);
router.get('/posts', adminController.getPosts);
router.get('/favourit', adminController.getFavourit);
router.get('/edit-post/:postId', adminController.getEditPost);
router.post('/add-post', adminController.postAddPost);
router.post('/edit-post', adminController.postEditPost);
router.post('/delete-post', adminController.postDeletePost);
router.post('/favourit', adminController.postFavourit);
router.post('/delete-favourit', adminController.deleteFavourit);

module.exports = router;
