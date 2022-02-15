const express = require('express')
const app = express()
const port = 8080

const createboard = require('./createboard');

app.set('view engine', 'pug');
app.use(express.static('static', {}));

// User-visible paths

app.get('/', (req, res) => {
  res.render('home');
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

app.post('/action-new', (req, res) => {
  createboard.createPost(req.params.title).then((new_id) => {
    res.redirect(`/b/${new_id}`)
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});
