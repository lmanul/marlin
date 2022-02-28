const fs = require('fs')

const DATA_DIR = 'data/boards/';

let boards = {};

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
          console.log('Done');
          add(obj.id, obj.title, obj.seconds_since_epoch || 0);
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
