const { Lyric } = require('../models');
const AppError = require('../utils/appError');

class LyricService {
  async getTrackLyrics(trackId) {
    const lyricsOfTrack = await Lyric.findOne({ trackId });

    if (!lyricsOfTrack)
      throw new AppError(`No lyrics found with track id ${trackId}`, 404);

    return lyricsOfTrack;
  }

  async createTrackLyrics(data) {
    const lyricsOfTrack = await Lyric.create(data);
    return lyricsOfTrack;
  }
}

module.exports = new LyricService();
