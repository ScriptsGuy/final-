const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

exports.getHome = (req, res, next) => {
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Post.find({ title: regex })
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
  } else {
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
  }
};
exports.getDetail = (req, res, next) => {
  const { postId } = req.params;
  Post.findById(postId)
    .populate('userId')
    .populate({
      path: 'comments',
      populate: {
        path: 'userId',
        model: 'User'
      }
    })
    .then((post) => {
      // console.log(post);
      res.render('shop/post-detail', {
        pageTitle: 'Detail Page',
        path: '/',
        post,
        csrfToken: req.csrfToken()
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
// exports.postComment = (req, res, next) => {
//   const { postId } = req.body;
//   const { comment } = req.body;
//   const currentDate = new Date();
//   const date = `${currentDate.getDate()}/${currentDate.getMonth()}/${currentDate.getFullYear()}`;

//   const addedComment = new Comment({
//     comment,
//     date,
//     postId,
//     userId: req.session.user
//   });
//   // console.log(req.session.user);
//   addedComment
//     .save()
//     .then((theComment) => {
//       // console.log(theComment);
//       Post.findById(postId)
//         .then((post) => {
//           post.comments.push(theComment);
//           return post.save();
//         })
//         .then((commentsInPost) => {
//           // console.log(commentsInPost);
//           res.redirect('back');
//         })
//         .catch((err) => {
//           console.log(err);
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
exports.postComment = (req, res, next) => {
  const { postId } = req.body;
  const { comment } = req.body;
  const currentDate = new Date();
  const date = `${currentDate.getDate()}/${currentDate.getMonth()}/${currentDate.getFullYear()}`;

  const addedComment = new Comment({
    comment,
    date,
    postId,
    userId: req.session.user
  });
  // console.log(req.session.user);
  addedComment
    .save()
    .then((theComment) => {
      const commentId = theComment._id;
      // console.log(theComment, commentId);
      Post.findById(postId)
        .then((post) => {
          post.comments.push(theComment);
          return post.save();
          // res.send(theComment);
        })
        .then((result) => {
          Comment.findById(commentId)
            .populate('userId')
            .then((commentusrpopulated) => {
              res.send(commentusrpopulated);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postReport = (req, res, next) => {
  const { postId } = req.body;
  console.log(postId);
  const { reportMessage } = req.body;
  Post.findById(postId)
    .then((post) => {
      User.findById(post.userId)
        .then((user) => {
          user.report.time++;
          user.report.messages.push(reportMessage);
          user.save();
          console.log(user);
          res.redirect('back');
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postRating = (req, res, next) => {
  const { postId } = req.body;
  const { stars } = req.body;
  console.log(stars, postId);
  res.redirect('/');
};
