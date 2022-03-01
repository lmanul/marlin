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

if (!process.env.MARLIN_GOOGLE_CLIENT_ID || !process.env.MARLIN_GOOGLE_CLIENT_SECRET) {
  console.log('Please set these two environment variables before starting ' +
              'this server: MARLIN_GOOGLE_CLIENT_ID and ' +
              'MARLIN_GOOGLE_CLIENT_SECRET. You ' +
              'can get those from https://console.cloud.google.com/apis/credentials');
  process.exit();
}

// Authentication

app.use(session({ secret: "secret", resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

const authUser = (request, accessToken, refreshToken, profile, done) => {
  return done(null, profile);
};

passport.use(new GoogleStrategy({
    clientID:     process.env.MARLIN_GOOGLE_CLIENT_ID,
    clientSecret: process.env.MARLIN_GOOGLE_CLIENT_SECRET,
    callbackURL:  "/auth/google/callback",
    passReqToCallback   : true
  }, authUser));

passport.serializeUser((user, done) => {
   done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get('/auth/google/callback', passport.authenticate( 'google', {
   successRedirect: '/',
   failureRedirect: '/login'
}));

app.get('/auth/google', passport.authenticate('google', {
  scope: [ 'email', 'profile' ] }
));

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated() && (!process.env.MARLIN_DOMAIN ||
      req.user.email.endsWith(process.env.MARLIN_DOMAIN))) {
    return next();
  }
  req.logOut();
  res.redirect("/login");
};

app.get("/login", (req, res) => {
  res.render("login.ejs", {
    'loggedInUserAvatar': null,
    'loggedInUserEmail': null,
    'domain': process.env.MARLIN_DOMAIN});
});

app.post("/logout", (req,res) => {
   req.logOut();
   res.redirect("/login");
});

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
  res.render('home', {
    'boards': displayBoards,
    'loggedInUserAvatar': req.user.picture,
    'loggedInUserEmail': req.user.email,
  });
});

app.get('/new', checkAuthenticated, (req, res) => {
  res.render('create_board');
});

app.get('/b/:id', checkAuthenticated, (req, res) => {
  res.render('board', {'board_id': req.params.id});
});

// Invisible paths

app.get('/boards', (req, res) => {
  res.json('{boards: []}');
});

app.get('/action-new', checkAuthenticated, (req, res) => {
  createboard.createPost(req.query.title).then((new_id) => {
    res.redirect(`/b/${new_id}`);
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});
