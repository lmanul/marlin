const express = require('express')
const app = express()
const port = 8080

app.use(express.static('static', {}));

// User-visible paths

app.get('/', (req, res) => {
  res.send('Hello World! <a href="/new">Create new board</a>')
});

app.get('/new', (req, res) => {
  res.send('Create a new board');
});

app.get('/b/:id', (req, res) => {
  res.send('This is board ' + req.params.id);
});

// Invisible paths

app.get('/boards', (req, res) => {
  res.json('{boards: []}');
});

app.post('action-new', (req, res) => {
  res.status(400);
  res.send('Not implemented yet');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});
