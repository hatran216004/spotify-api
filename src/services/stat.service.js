const { Track, Artist, Album } = require('../models');

class StatService {
  async getStats() {
    const [totalTracks, totalArtist, totalAlbums] = await Promise.all([
      Track.countDocuments(),
      Artist.countDocuments(),
      Album.countDocuments()
    ]);

    return { totalTracks, totalArtist, totalAlbums };
  }
}

module.exports = new StatService();
