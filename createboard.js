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
      const newId = randomId();
      const boardObj = {
        id: newId,
        title: title,
        seconds_since_epoch: Math.round(new Date().getTime() / 1000),
      };

      console.log('Writing file for "' + title + '"...');
      fs.writeFile(
        DATA_DIR + newId + '.json', JSON.stringify(boardObj), 'utf8', () => {
          list.add(newId, title, 0);
          console.log('Done');
          resolve(newId);
        });
    });
  },
};
