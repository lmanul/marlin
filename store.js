var Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"));
// const fs = require('fs')
const Board = require('./model/board')
const Question = require('./model/question')

const DATA_DIR = 'data';
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
  return fs.readdirAsync(BOARDS_DIR).then((files) => {
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
  const questionVotes = {};
  let totalVoteCount = 0;
  questionIdsForBoard[id].forEach((questionId) => {
    const question = questions[questionId];
    const ups = question.upVoters.size;
    const mehs = question.mehVoters.size;
    const downs = question.downVoters.size;
    questionVotes[questionId] = {
      'up': ups, 'down': downs, 'meh': mehs,
    };
    totalVoteCount += ups + mehs + downs;
  });
  board['questionVotes'] = questionVotes;
  board['totalVoteCount'] = totalVoteCount;
  return board;
};

const getQuestion = (id) => {
  return questions[id];
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

const vote = (questionId, vote, email) => {
  const question = questions[questionId];
  if (!question) {
    return;
  }
  switch(vote) {
    case 'up':
      question.upVoters.add(email);
      question.downVoters.delete(email);
      question.mehVoters.delete(email);
      break;
    case 'meh':
      question.mehVoters.add(email);
      question.upVoters.delete(email);
      question.downVoters.delete(email);
      break;
    case 'down':
      question.downVoters.add(email);
      question.upVoters.delete(email);
      question.mehVoters.delete(email);
      break;
  }
};

const getVotesForBoardByUser = (boardId, email) => {
  const userVotes = {};
  const questionIds = questionIdsForBoard[boardId];
  questionIds.forEach((questionId) => {
    const question = questions[questionId];
    if (question.upVoters.has(email)) {
      userVotes[questionId] = 'up';
    } else if (question.mehVoters.has(email)) {
      userVotes[questionId] = 'meh';
    } else if (question.downVoters.has(email)) {
      userVotes[questionId] = 'down';
    }
  });
  return userVotes;
};

const _ensureDirectories = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(BOARDS_DIR)) {
    fs.mkdirSync(BOARDS_DIR, { recursive: true });
  }
  if (!fs.existsSync(QUESTIONS_DIR)) {
    fs.mkdirSync(QUESTIONS_DIR, { recursive: true });
  }
};

const _loadBoardFromDisk = (file) => {
  return fs.readFileAsync(BOARDS_DIR + '/' + file, 'utf8').then((data) => {
    const board = Board.deserialize(JSON.parse(data));
    addBoard(board);
    return _loadQuestionsForBoardFromDisk(board.id);
  });
};

const _loadQuestionsForBoardFromDisk = (boardId) => {
  return new Promise((resolve, reject) => {
    console.log('Reading questions for board "' + boardId + '"...');
    const board = boards[boardId];
    if (!board) {
      reject('I could not find board "' + boardId + '"');
    }
    return fs.readdirAsync(board.getQuestionsDir()).then((files) => {
      const jsonFiles = [];
      files.forEach(file => {
        if (file.endsWith('.json')) {
          jsonFiles.push(file);
        }
      });
      if (!jsonFiles.length) {
        resolve();
      }
      let questionPromises = [];
      jsonFiles.forEach(file => {
        questionPromises.push(_loadQuestionFromDisk(board.getQuestionsDir() + file));
      });
      return Promise.all(questionPromises).then(() => {
        resolve();
      });
    });
  });
};

const _loadQuestionFromDisk = (file) => {
  return fs.readFileAsync(file, 'utf8').then((data) => {
    const question = Question.deserialize(JSON.parse(data));
    addQuestion(question);
    console.log('Loaded ' + file);
  }).catch((err) => {
    console.log('Could not load question file ' + file + ': ' + err);
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
  getQuestion,
  getVotesForBoardByUser,
  init,
  vote,
};
