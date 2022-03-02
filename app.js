const express = require('express')

const app = express()
const port = 8080

const authentication = require('./authentication');
const createboard = require('./createboard');
const createquestion = require('./createquestion');
const store = require('./store')
const util = require('./util');

app.set('view engine', 'ejs');
app.use('/s', express.static('static', {}));

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
store.init(() => {
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

app.get('/b-data/:id', (req, res) => {
  res.json('{"test": "hello"}');
});

app.get('/action-new-board', authentication.checkAuthenticated, (req, res) => {
  if (!!req.user.email) {
    createboard.createBoard(req.query.title, req.user.email).then((newId) => {
      res.redirect(`/b/${newId}`);
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/action-new-question', authentication.checkAuthenticated, (req, res) => {
  if (!!req.user.email) {
    const authorEmail = req.query && req.query.anon === 'anon-no' ?
          req.user.email : '';
    const authorName = req.query && req.query.anon === 'anon-no' ?
          req.user.displayName : '';
    createquestion.createQuestion(req.query.boardId, req.query.questionText,
                                  req.query.questionContext, authorEmail,
                                  authorName).then((newId) => {
      res.redirect('/b/' + req.query.boardId);
    });
  } else {
    res.redirect('/login');
  }
});
