const { Song, Artist, Album } = require('../models');

class StatService {
  async getStats() {
    const [totalSongs, totalArtist, totalAlbums] = await Promise.all([
      Song.countDocuments(),
      Artist.countDocuments(),
      Album.countDocuments()
    ]);

    return { totalSongs, totalArtist, totalAlbums };
  }
}

module.exports = new StatService();
