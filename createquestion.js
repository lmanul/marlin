const fs = require('fs')
const store = require('./store');
const Question = require('./model/question');

module.exports = {
  createQuestion: (boardId, text, context, authorEmail, authorName) => {
    const board = store.getBoard(boardId);
    const dataDir = 'data/questions/' + boardId + '/';
    return new Promise((resolve, reject) => {
      const newId = Question.generateId();
      const question = new Question(
          newId, boardId, text, context, authorEmail, authorName);

      console.log('Writing file for question "' + newId + '"...');

      fs.writeFile(board.getQuestionsDir() + newId + '.json',
                   question.serialize(), 'utf8', () => {
          // list.add(board);
          console.log('Done');
          resolve(newId);
        });
    });
  },
};
