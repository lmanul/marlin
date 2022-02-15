const fs = require('fs')

const DATA_DIR = 'data/boards/';

module.exports = {
  createPost: (title) => {
    return new Promise((resolve, reject) => {
      console.log('Creating...');
      const newId = 'abcd-efgh';
      const boardObj = {
        id: newId,
        title: title,
      };

      fs.writeFile(
        DATA_DIR + newId + '.json', JSON.stringify(boardObj), 'utf8', () => {
          resolve(newId);
        });
    });
  },
};
