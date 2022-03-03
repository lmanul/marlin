const util = require('../util');

class Question {
  constructor(id, boardId, text, context, authorEmail, authorName,
             upVotes, downVotes, mehVotes) {
    this.id = id;
    this.boardId = boardId;
    this.text = text;
    this.context = context;
    // These two are the empty string if anonymous.
    this.authorEmail = authorEmail;
    this.authorName = authorName;
    this.comments = [];
    this.upVotes = upVotes || 0;
    this.downVotes = downVotes || 0;
    this.mehVotes = mehVotes || 0;
  }

  static generateId() {
    return util.oneRandomLetter() + util.oneRandomLetter() +
      util.oneRandomLetter() + util.oneRandomLetter();
  }

  static deserialize(obj) {
    return new Question(obj.id, obj.boardId, obj.text, obj.context,
                        obj.authorEmail, obj.authorName, obj.upVotes,
                       obj.downVotes, obj.mehVotes);
  }

  serialize() {
    return JSON.stringify(this);
  }
}

module.exports = Question;
