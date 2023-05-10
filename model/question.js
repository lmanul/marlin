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
    this.upVoters = upVoters || new Set();
    this.downVoters = downVoters || new Set();
    this.mehVoters = mehVoters || new Set();
  }

  static generateId() {
    return util.oneRandomLetter() + util.oneRandomLetter() +
      util.oneRandomLetter() + util.oneRandomLetter() + '-' +
      util.oneRandomLetter() + util.oneRandomLetter() +
      util.oneRandomLetter() + util.oneRandomLetter();
  }

  static deserialize(obj) {
    return new Question(obj.id, obj.boardId, obj.text, obj.context,
                        obj.authorEmail, obj.authorName, new Set(obj.upVoters),
                        new Set(obj.downVoters), new Set(obj.mehVoters));
  }

  serialize() {
    const obj = JSON.parse(JSON.stringify(this));
    this['upVoters'] = Array.from(this.upVoters);
    this['mehVoters'] = Array.from(this.mehVoters);
    this['downVoters'] = Array.from(this.downVoters);
    return JSON.stringify(obj);
  }
}

module.exports = Question;
