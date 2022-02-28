class Board {
  constructor(id, title, date) {
    this.id = id;
    this.title = title;
    this.date = date;
  }

  serialize() {
    return JSON.stringify({
      'id': this.id,
      'title': this.title,
      'date': this.date,
    });
  }
}

module.exports = Board;
