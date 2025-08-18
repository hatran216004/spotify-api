const { statService } = require('../services');
const { catchAsync, sendSuccess } = require('../utils');

exports.getStats = catchAsync(async (req, res, next) => {
  const { totalTracks, totalArtist, totalAlbums } =
    await statService.getStats();
  sendSuccess(res, { stats: { totalTracks, totalArtist, totalAlbums } }, 200);
});
