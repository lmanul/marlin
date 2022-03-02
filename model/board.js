const util = require('../util');

class Board {
  constructor(id, title, date, creatorEmail) {
    this.id = id;
    this.title = title;
    // Stored as the number of seconds since the epoch.
    this.date = date;
    this.creatorEmail = creatorEmail;
  }

  static deserialize(obj) {
    return new Board(obj.id, obj.title, obj.date || 0,
                     obj.creatorEmail || 'unknown@unknown.com');
  }

  static generateId() {
    return util.oneRandomLetter() + util.oneRandomLetter() +
      util.oneRandomLetter() + util.oneRandomLetter() + '-' +
      util.oneRandomLetter() + util.oneRandomLetter() +
      util.oneRandomLetter() + util.oneRandomLetter();
  }

  getDisplayDate() {
    const dateObj = new Date(0);
    dateObj.setUTCSeconds(this.date);
    return dateObj.getFullYear() + '-' +
      ('' + (dateObj.getMonth() + 1)).padStart(2, '0') + '-' +
      ('' + dateObj.getDate()).padStart(2, '0');
  }

  getQuestionsDir() {
    return 'data/questions/' + this.id + '/';
  }

  serialize() {
    return JSON.stringify(this);
  }
}

module.exports = Board;
