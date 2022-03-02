const fs = require('fs')
const Question = require('./model/question');

module.exports = {
  createQuestion: (boardId, text, context, author) => {
    const dataDir = 'data/questions/' + boardId + '/';
    return new Promise((resolve, reject) => {
      const newId = Question.generateId();
      const question = new Question(newId, boardId, text, context, author);

      console.log('Writing file for question "' + newId + '"...');

      fs.writeFile(
        dataDir + newId + '.json', question.serialize(), 'utf8', () => {
          // list.add(board);
          console.log('Done');
          resolve(newId);
        });
    });
  },
};
