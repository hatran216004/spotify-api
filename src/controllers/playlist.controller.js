const { Playlist } = require('../models');
const playlistService = require('../services/playlist.service');
const { catchAsync, sendSuccess } = require('../utils');
const { createOne } = require('./base.controller');

exports.createPlaylist = createOne(Playlist);

exports.reorderPlaylist = catchAsync(async (req, res, next) => {
  const playlist = await playlistService.reorderPlaylist(
    req.params.id,
    req.body
  );
  sendSuccess(res, { playlist }, 200);
});
