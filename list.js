const fs = require('fs')

const DATA_DIR = 'data/boards/';

let boards = {};

const init = () => {
  fs.readdir(DATA_DIR, (err, files) => {
    files.forEach(file => {
      fs.readFile(DATA_DIR + '/' + file, 'utf8', (err, data) => {
        if (err) {
          console.log('Error reading file');
        } else {
          const obj = JSON.parse(data);
          add(obj.id, obj.title, 0);
        }
      });
    });
  });
};

const add = (id, title, date) => {
  boards[id] = [title, date];
};

module.exports = {
  add,
  boards,
  init,
};