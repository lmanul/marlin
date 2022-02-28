const fs = require('fs')
const Board = require('./model/board')

const DATA_DIR = 'data/boards/';

let boards = [];

const init = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.readdir(DATA_DIR, (err, files) => {
    files.forEach(file => {
      console.log('Reading "' + file + '"...');
      fs.readFile(DATA_DIR + '/' + file, 'utf8', (err, data) => {
        if (err) {
          console.log('Error reading file');
        } else {
          const obj = JSON.parse(data);
          const board = new Board(obj.id, obj.title, obj.seconds_since_epoch || 0);
          console.log('Done');
          add(board);
        }
      });
    });
  });
};

const add = (board) => {
  boards.push(board);
  // Sort in reverse-chronological order.
  boards.sort((one, two) => two.date - one.date);
};

module.exports = {
  add,
  boards,
  init,
};
