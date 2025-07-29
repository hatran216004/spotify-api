const Song = require('../models/song.model');

class SongService {
  async createOne(data) {
    const song = await Song.create(data);
    return song;
  }

  deleteSong() {
    //
  }

  updateSong() {
    //
  }
}

module.exports = new SongService();
