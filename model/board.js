class Board {
  constructor(id, title, date) {
    this.id = id;
    this.title = title;
    // Stored as the number of seconds since the epoch.
    this.date = date;
  }

  static deserialize(obj) {
    return new Board(obj.id, obj.title, obj.seconds_since_epoch || 0);
  }

  serialize() {
    return JSON.stringify({
      'id': this.id,
      'title': this.title,
      'seconds_since_epoch': this.date,
    });
  }
}

module.exports = Board;
