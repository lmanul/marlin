const fs = require('fs')
const list = require('./list')

const DATA_DIR = 'data/boards/';

const oneRandomLetter = () => {
  return String.fromCharCode(97 + Math.floor(Math.random() * 26));
};

const randomId = () => {
  return oneRandomLetter() + oneRandomLetter() + oneRandomLetter() + oneRandomLetter() +
    '-' + oneRandomLetter() + oneRandomLetter() + oneRandomLetter() + oneRandomLetter();
};

module.exports = {
  createPost: (title) => {
    return new Promise((resolve, reject) => {
      console.log('Creating... ' + title);
      const newId = randomId();
      const boardObj = {
        id: newId,
        title: title,
      };

      fs.writeFile(
        DATA_DIR + newId + '.json', JSON.stringify(boardObj), 'utf8', () => {
          list.add(newId, title, 0);
          resolve(newId);
        });
    });
  },
};
