const util = require('../util');

class Question {
  constructor(id, boardId, text, context, authorEmail, authorName,
             upVoters, downVoters, mehVoters) {
    this.id = id;
    this.boardId = boardId;
    this.text = text;
    this.context = context;
    // These two are the empty string if anonymous.
    this.authorEmail = authorEmail;
    this.authorName = authorName;
    this.comments = [];
    this.upVoters = upVoters || [];
    this.downVoters = downVoters || [];
    this.mehVoters = mehVoters || [];
  }

  static generateId() {
    return util.oneRandomLetter() + util.oneRandomLetter() +
      util.oneRandomLetter() + util.oneRandomLetter();
  }

  static deserialize(obj) {
    return new Question(obj.id, obj.boardId, obj.text, obj.context,
                        obj.authorEmail, obj.authorName, obj.upVoters,
                       obj.downVoters, obj.mehVoters);
  }

  serialize() {
    return JSON.stringify(this);
  }
}

module.exports = Question;
