const express = require('express')
const session = require('express-session')
const passport = require('passport')
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

const app = express()
const port = 8080

const createboard = require('./createboard');
const list = require('./list')

app.set('view engine', 'ejs');
app.use(express.static('static', {}));

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.log('Please set these two environment variables before starting ' +
              'this server: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET. You ' +
              'can get those from https://console.cloud.google.com/apis/credentials');
  process.exit();
}

// Authentication

app.use(session({
    secret: "secret",
    resave: false ,
    saveUninitialized: true ,
}))
app.use(passport.initialize())
app.use(passport.session())

const authUser = (request, accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  "http://127.0.0.1:8080/auth/google/callback",
    passReqToCallback   : true
  }, authUser));

passport.serializeUser((user, done) => {
   done(null, user);
})

passport.deserializeUser((user, done) => {
  done (null, user);
})

app.get('/auth/google/callback', passport.authenticate( 'google', {
   successRedirect: '/',
   failureRedirect: '/login'
}));

app.get('/auth/google', passport.authenticate('google', {
  scope: [ 'email', 'profile' ] }
));

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next(); }
  res.redirect("/login");
}

app.get("/login", (req, res) => {
  res.render("login.ejs");
})

app.post("/logout", (req,res) => {
   req.logOut();
   res.redirect("/login");
   console.log('-------> User Logged out');
})

list.init();

// User-visible paths

app.get('/', checkAuthenticated, (req, res) => {
  const boards = list.boards;
  const displayBoards = [];
  for (const board of boards) {
    const date = new Date(0);
    date.setUTCSeconds(board.date);
    displayBoards.push({
      id: board.id,
      title: board.title,
      date: date,
    });
  }
  res.render('home', {'boards': displayBoards});
});

app.get('/new', (req, res) => {
  res.render('create_board');
});

app.get('/b/:id', (req, res) => {
  res.render('board', {'board_id': req.params.id});
});

// Invisible paths

app.get('/boards', (req, res) => {
  res.json('{boards: []}');
});

app.get('/action-new', (req, res) => {
  createboard.createPost(req.query.title).then((new_id) => {
    res.redirect(`/b/${new_id}`);
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});
