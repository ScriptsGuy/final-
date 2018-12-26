const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const colors = require('colors');

const app = express();
const store = new MongoDBStore({
  uri: 'mongodb://localhost/STUDY',
  collection: 'sessions'
});

const homeRoutes = require('./routes/home');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const User = require('./models/user');

mongoose.Promise = global.Promise;

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'longStringSecret', resave: false, saveUninitialized: false, store }));

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  // eslint-disable-next-line no-underscore-dangle
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use('/admin', adminRoutes);
app.use(homeRoutes);
app.use(authRoutes);

app.use((req, res, next) => {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: '/404'
  });
});

mongoose
  .connect(
    'mongodb://localhost/STUDY',
    { useNewUrlParser: true }
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          userName: 'SalahBerriani',
          email: 'salaheddinberriani@gmail.com',
          favourit: {
            posts: []
          }
        });
        return user.save();
      }
    });

    app.listen(3000, () => {
      console.log('Listening on Port 3000'.bgWhite.black);
    });
  })
  .catch((err) => {
    console.log(err);
  });