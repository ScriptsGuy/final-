const express = require('express');
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
    body('password', 'Password has to be valid.')
      .isLength({ min: 8 })
      .trim()
  ],
  authController.postLogin
);
router.post('/logout', authController.postLogout);
router.get('/signup', authController.getSignup);
router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom((value, { req }) =>
        User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject('Email exist already!!');
          }
        })
      )
      .normalizeEmail(),

    check('userName')
      .isAlphanumeric()
      .withMessage('Please enter a valid user name')
      .custom((value, { req }) =>
        User.findOne({ userName: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject('UserName exist already!!');
          }
        })
      ),
    body('password', 'password should be at least 8 characters')
      .isLength({ min: 8 })
      .trim(),
    body('confirmsPssword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('password have to match!');
        }
        return true;
      })
      .trim()
  ],
  authController.postSignup
);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;
