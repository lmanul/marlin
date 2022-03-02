const fs = require('fs')
const store = require('./store')
const Board = require('./model/board')

const DATA_DIR = 'data/boards/';

module.exports = {
  createBoard: (title, creatorEmail) => {
    return new Promise((resolve, reject) => {
      const newId = Board.generateId();
      const board = new Board(
        newId, title, Math.round(new Date().getTime() / 1000), creatorEmail);

      console.log('Writing file for board "' + title + '"...');
      fs.writeFile(
        DATA_DIR + newId + '.json', board.serialize(), 'utf8', () => {
          store.addBoard(board);
          console.log('Done');
          resolve(newId);
        });
    });
  },
};
