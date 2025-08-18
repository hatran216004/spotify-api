const { catchAsync, sendSuccess } = require('../utils');
const { lyricService } = require('../services');

exports.getTrackLyrics = catchAsync(async (req, res, next) => {
  const lyricsOfTrack = await lyricService.getTrackLyrics(req.params.id);
  sendSuccess(res, { lyrics: lyricsOfTrack }, 200);
});

exports.updateTrackLyrics = catchAsync(async (req, res, next) => {});
exports.deleteTrackLyrics = catchAsync(async (req, res, next) => {});
