const { Playlist } = require('../models');
const playlistService = require('../services/playlist.service');
const { catchAsync, sendSuccess } = require('../utils');
const { updateOne, deleteOne, getAll, getOne } = require('./base.controller');

exports.reorderPlaylist = catchAsync(async (req, res, next) => {
  const playlist = await playlistService.reorderPlaylist(
    req.params.id,
    req.body
  );
  sendSuccess(res, { playlist }, 200);
});

exports.deleteSongFromPlaylist = catchAsync(async (req, res, next) => {
  const { id: playlistId, songId } = req.params;
  const playlist = await playlistService.deleteSongFromPlaylist(
    playlistId,
    songId
  );

  sendSuccess(res, { playlist }, 200);
});

exports.createPlaylist = catchAsync(async (req, res, next) => {
  const playlist = await playlistService.createOne({
    ...req.body,
    userId: req.user.id
  });
  sendSuccess(res, { playlist }, 201);
});

exports.getAllPlaylists = getAll(Playlist);
exports.getPlaylist = getOne(Playlist);
exports.updatePlaylist = updateOne(Playlist);
exports.deletePlaylist = deleteOne(Playlist);
