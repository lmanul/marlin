class Board {
  constructor(id, title, date, creatorEmail) {
    this.id = id;
    this.title = title;
    // Stored as the number of seconds since the epoch.
    this.date = date;
    this.creatorEmail = creatorEmail;
  }

  static deserialize(obj) {
    return new Board(obj.id, obj.title, obj.seconds_since_epoch || 0,
                     obj.creator_email || 'unknown@unknown.com');
  }

  serialize() {
    return JSON.stringify({
      'id': this.id,
      'title': this.title,
      'seconds_since_epoch': this.date,
      'creator_email': this.creatorEmail,
    });
  }
}

module.exports = Board;
