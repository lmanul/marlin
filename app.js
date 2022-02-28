const express = require('express')
const app = express()
const port = 8080

const createboard = require('./createboard');
const list = require('./list')

app.set('view engine', 'ejs');
app.use(express.static('static', {}));

list.init();

// User-visible paths

app.get('/', (req, res) => {
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
