const express = require('express')
const app = express()
const port = 8080

app.use(express.static('static', {}));

app.get('/', (req, res) => {
  res.send('Hello World! <a href="/new">Create new board</a>')
});

app.get('/new', (req, res) => {
  res.send('Create a new board');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});
