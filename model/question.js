const util = require('../util');

class Question {
  constructor(id, boardId, text, context) {
    this.id = id;
    this.boardId = boardId;
    this.text = text;
    this.context = context;
    this.comments = [];
  }

  static generateId() {
    return util.oneRandomLetter() + util.oneRandomLetter() +
      util.oneRandomLetter() + util.oneRandomLetter();
  }
}

module.exports = Question;
