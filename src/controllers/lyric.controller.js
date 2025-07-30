const { catchAsync, sendSuccess } = require('../utils');
const { lyricService } = require('../services');

exports.getSongLyrics = catchAsync(async (req, res, next) => {
  const lyricsOfSong = await lyricService.getSongLyrics(req.params.id);
  sendSuccess(res, { lyrics: lyricsOfSong }, 200);
});

exports.updateSongLyrics = catchAsync(async (req, res, next) => {});

exports.deleteSongLyrics = catchAsync(async (req, res, next) => {});
