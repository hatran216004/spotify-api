const { Track } = require('../models');
const Artist = require('../models/artist.model');
const AppError = require('../utils/appError');

class ArtistService {
  async createOne(data) {
    const newArtist = await Artist.create(data);
    return newArtist;
  }

  async getPopularTracks(artistId) {
    if (!artistId) {
      throw new AppError('Artist Id is required', 400);
    }

    // lean: trả về plain JavaScript object để có thể xóa artists
    const tracks = await Track.find({ artists: artistId })
      .sort('-playCount')
      .limit(10);
    return tracks;
  }
}

module.exports = new ArtistService();
