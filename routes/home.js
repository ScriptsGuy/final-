const express = require('express');

const router = express.Router();

const homeController = require('../controllers/home');

router.get('/', homeController.getHome);
router.get('/post/:postId', homeController.getDetail);
router.post('/add-comment', homeController.postComment);
router.post('/report', homeController.postReport);
router.post('/rating', homeController.postRating);

module.exports = router;
