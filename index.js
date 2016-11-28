require('dotenv').config()

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const facebookStrategy = require('passport-facebook').Strategy
const session = require('express-session')
const mongoStore = require('connect-mongo')(session);

const User = require('./models/user')
const Poll = require('./models/poll')

const pollsRoute = require('./routes/polls')

const config = require('./config')
const isAuthenticated = require('./utilities/util').isAuthenticated

const app = express()

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id, (err, doc) => {
    cb(err, doc)
  })
});

passport.use(new facebookStrategy({
    clientID: config.facebook.app_id,
    clientSecret: config.facebook.app_secret,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails'],
    passReqToCallback : true
  }, function(req, accessToken, refreshToken, profile, cb) {
    User.findOne({ provider: 'facebook', provider_id: profile.id }, (err, user) => {
      if (err) { return cb(err) }

      if (!user) {
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          provider: 'facebook',
          provider_id: profile.id
        })

        user.save((err) => {
          if (err) { console.log(err) }

          console.log('User saved!')
          console.log(user)
          return cb(null, user)
        })
      } else {
        console.log('User found!')
        console.log(user)
        return cb(null, user)
      }
    })
  }
));

var database_url = `mongodb://${config.db.host}/${config.db.name}`;
if (process.env.NODE_ENV === 'production') {
  database_url = process.env.MONGODB_URI;
}

mongoose.Promise = global.Promise;
mongoose.connect(database_url)

app.use(require('cookie-parser')())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
  secret: 'keyboard cat',
  store: new mongoStore({ mongooseConnection: mongoose.connection }),
  resave: true,
  saveUninitialized: true
}));

app.set('port', config.port)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  console.log('Setting up locals variable for template')
  res.locals.signed_in = req.isAuthenticated();
  res.locals.current_user = req.user
  next();
});

app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/',
  })
);

app.use('/polls', pollsRoute)

app.get('/my-polls', isAuthenticated, function(req, res, cb) {
  Poll.find({ owner: req.user.id }, (err, polls) => {
    if (err) { console.log(err) }

    res.render('polls/my-polls', {
      polls: polls
    })
  })
})

app.use('/', (req, res) => {
  res.render('pages/index')
})

app.listen(app.get('port'), () => {
  console.log(`Server ready on port: ${app.get('port')}`)
})
