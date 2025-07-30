const Song = require('../models/song.model');

class SongService {
  async createOne(data) {
    const song = await Song.create(data);

    return song;
  }

  async getAll() {
    return [];
  }

  deleteOne() {
    //
  }

  updateOne() {
    //
  }
}

module.exports = new SongService();
