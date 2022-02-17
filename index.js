const express = require('express')
const app = express()
const port = 8080

const createboard = require('./createboard');
const list = require('./list')

app.set('view engine', 'pug');
app.use(express.static('static', {}));

list.init();

// User-visible paths

app.get('/', (req, res) => {
  const boards = list.boards;
  const displayBoards = [];
  for (const boardId in boards) {
    displayBoards.push({
      id: boardId,
      title: boards[boardId][0]
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
