const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const colors = require('colors');
const faker = require('faker');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
// global.io = require('socket.io')(http);

const store = new MongoDBStore({
  uri: 'mongodb://localhost/STUDY',
  collection: 'sessions'
});

const csrfProtection = csrf();

const homeRoutes = require('./routes/home');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const User = require('./models/user');
const Post = require('./models/post');
const Comment = require('./models/comment');

mongoose.Promise = global.Promise;

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'longStringSecret', resave: false, saveUninitialized: false, store }));
app.use(csrfProtection);
app.use(flash());

// for (let i = 0; i < 100; i++) {
//   const post = new Post({
//     title: faker.lorem.sentence(),
//     category: faker.name.jobDescriptor(),
//     brand: faker.commerce.productName(),
//     Condition: faker.commerce.productAdjective(),
//     image: faker.image.image(),
//     price: faker.random.number(8000000),
//     priceState: faker.address.country(),
//     city: faker.address.city(),
//     phone: faker.phone.phoneNumber(),
//     email: faker.internet.email(),
//     description: faker.lorem.paragraphs(),
//     date: faker.date.past(),
//     userId: '5c2f97d58b468f3f4ba06e96',
//     comments: []
//   });
//   post.save();
// }

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

app.use((req, res, next) => {
  res.locals.isAuth = req.session.isLoggedIn;
  res.locals.user = req.session.user;
  res.locals.csrfToken = req.csrfToken();
  next();
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
    http.listen(3000, () => {
      console.log('Listening on Port 3000'.bgWhite.black);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// io.on('connection', (socket) => {
//   console.log('made socket connection');
//   console.log(user);
//   // socket.on('comment', (data) => {
//   //   console.log(data);
//   //   const commentData = new Comment(data);
//   //   commentData.save();
//   // //   // socket.broadcast.emit('comment', data);
//   // });
//   socket.on('comment', (data) => {
//     console.log(data);
//     const commentData = new Comment(data);

//     commentData.save();
//     io.sockets.emit('comment', data);
//   });
// });
