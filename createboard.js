const fs = require('fs')
const list = require('./list')
const Board = require('./model/board')

const DATA_DIR = 'data/boards/';

const randomId = () => {
};

module.exports = {
  createPost: (title, creatorEmail) => {
    return new Promise((resolve, reject) => {
      const newId = Board.generateId();
      const board = new Board(
        newId, title, Math.round(new Date().getTime() / 1000), creatorEmail);

      console.log('Writing file for "' + title + '"...');
      fs.writeFile(
        DATA_DIR + newId + '.json', board.serialize(), 'utf8', () => {
          list.add(board);
          console.log('Done');
          resolve(newId);
        });
    });
  },
};
