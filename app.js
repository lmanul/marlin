const express = require('express')

const app = express()
const port = 8080

const createboard = require('./createboard');
const authentication = require('./authentication');
const list = require('./list')
const util = require('./util');

app.set('view engine', 'ejs');
app.use(express.static('static', {}));

// Authentication

authentication.setupAuthentication(app);

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

// Only start listening for requests when we're done initializing our data.
list.init(() => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  });
});

// User-visible paths

app.get('/', authentication.checkAuthenticated, (req, res) => {
   res.render('home', {
    ...util.getLoggedInUserDetails(req),
    'boards': list.getBoards(),
  });
});

app.get('/new', authentication.checkAuthenticated, (req, res) => {
  res.render('create_board', util.getLoggedInUserDetails(req));
});

app.get('/b/:id', authentication.checkAuthenticated, (req, res) => {
  res.render('board', {
    ...util.getLoggedInUserDetails(req),
    'board': list.getBoard(req.params.id),
  });
});

// Invisible paths

app.get('/boards', (req, res) => {
  res.json('{boards: []}');
});

app.get('/action-new-board', authentication.checkAuthenticated, (req, res) => {
  if (!!req.user.email) {
    createboard.createPost(req.query.title, req.user.email).then((new_id) => {
      res.redirect(`/b/${new_id}`);
    });
  } else {
    res.redirect('/login');
  }
});
