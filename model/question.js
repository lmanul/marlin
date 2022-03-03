const util = require('../util');

class Question {
  constructor(id, boardId, text, context, authorEmail, authorName) {
    this.id = id;
    this.boardId = boardId;
    this.text = text;
    this.context = context;
    // These two are the empty string if anonymous.
    this.authorEmail = authorEmail;
    this.authorName = authorName;
    this.comments = [];
    this.upVotes = 0;
    this.downVotes = 0;
    this.mehVotes = 0;
  }

  static generateId() {
    return util.oneRandomLetter() + util.oneRandomLetter() +
      util.oneRandomLetter() + util.oneRandomLetter();
  }

  serialize() {
    return JSON.stringify(this);
  }
}

module.exports = Question;
