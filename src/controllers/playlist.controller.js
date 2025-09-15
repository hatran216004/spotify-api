const { PAGE_LIMIT } = require('../config/constants');
const { upload } = require('../middleware/fileUpload.middleware');
const { Playlist, UserLibrary } = require('../models');
const { userLibraryServices } = require('../services');
const playlistService = require('../services/playlist.service');
const { catchAsync, sendSuccess } = require('../utils');
const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const { updateOne, createOne } = require('./base.controller');

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
  const userId = req.user.id;
  const playlist = await playlistService.createOne(userId);
  await userLibraryServices.addPlaylist(userId, playlist.id);

  sendSuccess(res, { playlist }, 201);
});

exports.deleteMyPlaylist = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const playlistId = req.params.playlistId;

  await playlistService.deleteOne(userId, playlistId);
  await userLibraryServices.removePlaylist(userId, playlistId);

  sendSuccess(res, null, 204);
});

exports.getPlaylistUserLibrary = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const {
    items,
    pagination: { pageCount, currentPage }
  } = await userLibraryServices.getPlaylists(userId, req.query);

  sendSuccess(res, { items, pagination: { pageCount, currentPage } }, 200);
});

exports.uploadCoverImage = upload.single('coverImage');

exports.getAllPlaylists = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Playlist.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const playlists = await features.query.populate('user', 'username');
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

exports.getPopularPlaylists = catchAsync(async (req, res, next) => {
  const playlists = await Playlist.aggregate([
    {
      $match: { isPublic: true }
    },
    {
      $sample: {
        size: 8
      }
    }
  ]);
  sendSuccess(res, { playlists }, 200);
});

exports.getPlaylist = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const playlist = await Playlist.findById(id)
    .populate({
      path: 'tracks.trackId',
      populate: { path: 'artists', select: 'name avatarUrl' }
    })
    .populate({ path: 'user', select: 'username' });

  if (!playlist) {
    throw new AppError(`No playlist found with id: ${id}`, 404);
  }
  sendSuccess(res, { playlist }, 200);
});

exports.followPlaylist = catchAsync(async (req, res, next) => {
  const playlistId = req.params.id;
  const userId = req.user.id;
  const item = await userLibraryServices.addPlaylist(userId, playlistId);

  sendSuccess(res, { item }, 201);
});

exports.unfollowPlaylist = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const playlistId = req.params.id;

  await userLibraryServices.removeAlbum(userId, playlistId);

  sendSuccess(res, null, 204);
});

exports.deletePlaylist = catchAsync(async (req, res, next) => {
  const playlistId = req.params.id;
  const userId = req.user.id;
  await Promise.all([
    Playlist.findByIdAndDelete(playlistId),
    UserLibrary.findOneAndDelete({
      userId,
      itemId: playlistId,
      itemType: 'playlist'
    })
  ]);

  sendSuccess(res, null, 204);
});

exports.createPlaylist = createOne(Playlist);
exports.updatePlaylist = updateOne(Playlist);
