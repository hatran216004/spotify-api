const { Playlist } = require('../models');
const playlistService = require('../services/playlist.service');
const { catchAsync, sendSuccess } = require('../utils');
const {
  createOne,
  updateOne,
  deleteOne,
  getAll,
  getOne
} = require('./base.controller');

exports.getAllPlaylists = getAll(Playlist);
exports.getPlaylist = getOne(Playlist);
exports.createPlaylist = createOne(Playlist);
exports.updatePlaylist = updateOne(Playlist);
exports.deletePlaylist = deleteOne(Playlist);

exports.reorderPlaylist = catchAsync(async (req, res, next) => {
  const playlist = await playlistService.reorderPlaylist(
    req.params.id,
    req.body
  );
  sendSuccess(res, { playlist }, 200);
});
