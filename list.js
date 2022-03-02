const fs = require('fs')
const Board = require('./model/board')

const BOARDS_DIR = 'data/boards/';
const QUESTIONS_DIR = 'data/questions/';

let boards = {};
let cachedSortedBoards = [];

/**
 * Slow: reads data from disk. Should only be called at the start of the app's
 * lifetime.
 */
const init = (callback) => {
  if (!fs.existsSync(BOARDS_DIR)) {
    fs.mkdirSync(BOARDS_DIR, { recursive: true });
  }
  if (!fs.existsSync(QUESTIONS_DIR)) {
    fs.mkdirSync(QUESTIONS_DIR, { recursive: true });
  }
  fs.readdir(BOARDS_DIR, (err, files) => {
    const jsonFiles = [];
    files.forEach(file => {
      if (file.endsWith('.json')) {
        jsonFiles.push(file);
      }
    });
    if (!jsonFiles.length) {
      callback();
    }
    jsonFiles.forEach(file => {
      if (!file.endsWith('.json')) {
        return;
      }
      console.log('Reading "' + file + '"...');
      fs.readFile(BOARDS_DIR + '/' + file, 'utf8', (err, data) => {
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

const getBoard = (id) => {
  return boards[id];
};

const add = (board) => {
  boards[board.id] = board;
  _updateCachedSortedBoards();
  const questionsDirForThisBoard = QUESTIONS_DIR + '/' + board.id;
  if (!fs.existsSync(questionsDirForThisBoard)) {
    fs.mkdirSync(questionsDirForThisBoard, { recursive: true });
  }
};

const _updateCachedSortedBoards = () => {
  cachedSortedBoards = Object.values(boards);
  // Sort in reverse-chronological order.
  cachedSortedBoards.sort((one, two) => two.date - one.date);
};

module.exports = {
  add,
  getBoard,
  getBoards,
  init,
};
