const fs = require('fs')
const Board = require('./model/board')

const DATA_DIR = 'data/boards/';

let boards = {};
let cachedSortedBoards = [];

/**
 * Slow: reads data from disk. Should only be called at the start of the app's
 * lifetime.
 */
const init = (callback) => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.readdir(DATA_DIR, (err, files) => {
    const jsonFiles = [];
    files.forEach(file => {
      if (file.endsWith('.json')) {
        jsonFiles.push(file);
      }
    });
    jsonFiles.forEach(file => {
      if (!file.endsWith('.json')) {
        return;
      }
      console.log('Reading "' + file + '"...');
      fs.readFile(DATA_DIR + '/' + file, 'utf8', (err, data) => {
        if (err) {
          console.log('Error reading file');
        } else {
          const board = Board.deserialize(JSON.parse(data));
          add(board);
          console.log(`Read ${cachedSortedBoards.length} out of ${jsonFiles.length}`);
          if (jsonFiles.length === cachedSortedBoards.length) {
            // We're done reading data from disk.
            callback();
          }
        }
      });
    });
  });
};

const getBoards = (opt_creatorEmail) => {
  if (!opt_creatorEmail) {
    return cachedSortedBoards;
  }
  const filteredBoards = [];
  for (let i = 0; i < cachedSortedBoards.length; i++) {
    if (cachedSortedBoards[i] &&
        cachedSortedBoards[i].creatorEmail === opt_creatorEmail) {
      filteredBoards.push(cachedSortedBoards[i]);
    }
  }
  return filteredBoards;
};

const add = (board) => {
  boards[board.id] = board;
  _updateCachedSortedBoards();
};

const _updateCachedSortedBoards = () => {
  cachedSortedBoards = Object.values(boards);
  // Sort in reverse-chronological order.
  cachedSortedBoards.sort((one, two) => two.date - one.date);
};

module.exports = {
  add,
  getBoards,
  init,
};
