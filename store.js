const fs = require('fs')
const Board = require('./model/board')

const BOARDS_DIR = 'data/boards/';
const QUESTIONS_DIR = 'data/questions/';

// Board ID to board metadata.
let boards = {};
// Question ID to question metadata.
let questions = {};
// Board ID to list of questions.
let questionIdsForBoard = {};
// Boards, sorted by reverse chronological order.
let cachedSortedBoards = [];

/**
 * Slow: reads data from disk. Should only be called at the start of the app's
 * lifetime.
 */
const init = () => {
  _ensureDirectories();
  return fs.promises.readdir(BOARDS_DIR).then((files) => {
    const jsonFiles = [];
    files.forEach(file => {
      if (file.endsWith('.json')) {
        jsonFiles.push(file);
      }
    });
    let boardPromises = [];
    jsonFiles.forEach(file => {
      boardPromises.push(_loadBoardFromDisk(file).then(() => {
        console.log(`Loaded board "${file}"`);
      }));
    });
    return Promise.all(boardPromises);
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
  const board = boards[id];
  board['questionIds'] = questionIdsForBoard[id];
  return board;
};

const addBoard = (board) => {
  boards[board.id] = board;
  questionIdsForBoard[board.id] = [];
  _updateCachedSortedBoards();
  const questionsDirForThisBoard = QUESTIONS_DIR + '/' + board.id;
  if (!fs.existsSync(questionsDirForThisBoard)) {
    fs.mkdirSync(questionsDirForThisBoard, { recursive: true });
  }
};

const addQuestion = (question) => {
  questions[question.id] = question;
  questionIdsForBoard[question.boardId].push(question.id);
}

const _ensureDirectories = () => {
  if (!fs.existsSync(BOARDS_DIR)) {
    fs.mkdirSync(BOARDS_DIR, { recursive: true });
  }
  if (!fs.existsSync(QUESTIONS_DIR)) {
    fs.mkdirSync(QUESTIONS_DIR, { recursive: true });
  }
};

const _loadBoardFromDisk = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(BOARDS_DIR + '/' + file, 'utf8', (err, data) => {
      if (err) {
        console.log('Error reading file ' + file);
      } else {
        const board = Board.deserialize(JSON.parse(data));
        addBoard(board);
        _loadQuestionsForBoardFromDisk(board.id).then(() => {
          resolve();
        }).catch((err) => {
          reject(err);
        });
      }
    });
  });
};

const _loadQuestionsForBoardFromDisk = (boardId) => {
  return new Promise((resolve, reject) => {
    console.log('Reading questions for board "' + boardId + '"...');
    const board = boards[boardId];
    if (!board) {
      reject('I could not find board "' + boardId + '"');
    }
    console.log('That is dir ' + board.getQuestionsDir());
    fs.readdir(board.getQuestionsDir(), (err, files) => {
      if (err) {
        reject(err);
      }
      const jsonFiles = [];
      files.forEach(file => {
        if (file.endsWith('.json')) {
          console.log('Adding ' + file + ' for reading');
          jsonFiles.push(file);
        }
      });
      if (!jsonFiles.length) {
        resolve();
      }
      resolve();
    });
  });
};

const _updateCachedSortedBoards = () => {
  cachedSortedBoards = Object.values(boards);
  // Sort in reverse-chronological order.
  cachedSortedBoards.sort((one, two) => two.date - one.date);
};

module.exports = {
  addBoard,
  addQuestion,
  getBoard,
  getBoards,
  init,
};
