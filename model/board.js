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

  serialize() {
    return JSON.stringify(this);
  }
}

module.exports = Board;
