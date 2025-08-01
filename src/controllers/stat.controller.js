const { statService } = require('../services');
const { catchAsync, sendSuccess } = require('../utils');

exports.getStats = catchAsync(async (req, res, next) => {
  const { totalSongs, totalArtist, totalAlbums } = await statService.getStats();
  sendSuccess(res, { stats: { totalSongs, totalArtist, totalAlbums } }, 200);
});
