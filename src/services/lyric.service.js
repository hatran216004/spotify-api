const { Lyric } = require('../models');
const AppError = require('../utils/appError');

class LyricService {
  async getSongLyrics(songId) {
    const lyricsOfSong = await Lyric.findOne({ songId });

    if (!lyricsOfSong)
      throw new AppError(`No lyrics found with song id ${songId}`, 404);

    return lyricsOfSong;
  }

  async createSongLyrics(data) {
    const lyricsOfSong = await Lyric.create(data);
    return lyricsOfSong;
  }
}

module.exports = new LyricService();
