const { PAGE_LIMIT } = require('../config/constants');
const { upload } = require('../middleware/fileUpload.middleware');
const { Playlist } = require('../models');
const playlistService = require('../services/playlist.service');
const { catchAsync, sendSuccess } = require('../utils');
const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const { updateOne, deleteOne, createOne } = require('./base.controller');

exports.reorderPlaylist = catchAsync(async (req, res, next) => {
  const playlist = await playlistService.reorderPlaylist(
    req.params.id,
    req.body
  );
  sendSuccess(res, { playlist }, 200);
});

exports.addTrackToPlaylist = catchAsync(async (req, res, next) => {
  const { id: playlistId } = req.params;
  const playlist = await playlistService.addTrackToPlaylist(
    playlistId,
    req.body.trackId
  );

  sendSuccess(res, { playlist }, 200);
});

exports.removeTrackFromPlaylist = catchAsync(async (req, res, next) => {
  const { id: playlistId, trackId } = req.params;
  const playlist = await playlistService.removeTrackFromPlaylist(
    playlistId,
    trackId
  );
  sendSuccess(res, { playlist }, 200);
});

exports.createMyPlaylist = catchAsync(async (req, res, next) => {
  const playlist = await playlistService.createOne(req.user.id);
  sendSuccess(res, { playlist }, 201);
});

exports.getMyPlaylists = catchAsync(async (req, res, next) => {
  const {
    playlists,
    pagination: { pageCount, currentPage }
  } = await playlistService.getMyPlaylists(req.user.id, req.query);

  sendSuccess(res, { playlists, pagination: { pageCount, currentPage } }, 200);
});

exports.uploadCoverImage = upload.single('coverImage');

exports.getAllPlaylists = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Playlist.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const playlists = await features.query.populate('userId', 'username');
  const countDocs = await Playlist.countDocuments();
  const pageCount = Math.ceil(countDocs / (+req.query.limit || PAGE_LIMIT));

  sendSuccess(
    res,
    {
      playlists,
      pagination: { pageCount, currentPage: req.query.page || 1 }
    },
    200
  );
});

exports.getPlaylist = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const playlist = await Playlist.findById(id)
    .populate('tracks.trackId')
    .populate('userId', 'username');

  if (!playlist) {
    throw new AppError(`No playlist found with id: ${id}`, 404);
  }
  sendSuccess(res, { playlist }, 200);
});

exports.createPlaylist = createOne(Playlist);
exports.updatePlaylist = updateOne(Playlist);
exports.deletePlaylist = deleteOne(Playlist);
